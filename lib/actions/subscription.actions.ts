'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { 
  SUBSCRIPTION_PLANS, 
  getPlanById, 
  getPlanFeatures, 
  calculateUsageCost,
  PlanId 
} from "@/lib/subscription.config";
import { 
  getClerkPlanId, 
  getMaxTutorsFromClerk, 
  getVoiceMinutesFromClerk, 
  getMaxSessionDurationFromClerk 
} from "@/lib/clerk-plan-mapping";

export interface UserSubscription {
  userId: string;
  planId: PlanId;
  voiceMinutesUsed: number;
  voiceMinutesLimit: number;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}

export interface SessionUsage {
  sessionId: string;
  userId: string;
  tutorId: string;
  durationMinutes: number;
  startTime: Date;
  endTime: Date;
  cost: number;
}

// Sync user subscription from Clerk to database
export const syncUserSubscription = async (): Promise<void> => {
  const { userId, has } = await auth();
  if (!userId) return;

  const supabase = createSupabaseClient();
  const planId = getClerkPlanId(has) as PlanId;
  const planFeatures = getPlanFeatures(planId);

  // Get current billing period (first day of current month)
  const currentPeriodStart = new Date();
  currentPeriodStart.setDate(1);
  currentPeriodStart.setHours(0, 0, 0, 0);
  
  const currentPeriodEnd = new Date(currentPeriodStart);
  currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
  currentPeriodEnd.setTime(currentPeriodEnd.getTime() - 1);

  // Upsert user subscription record
  const { error } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      plan_id: planId,
      voice_minutes_limit: planFeatures.voiceMinutes,
      current_period_start: currentPeriodStart.toISOString(),
      current_period_end: currentPeriodEnd.toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });

  if (error) {
    console.error('Error syncing user subscription:', error);
  }
};

// Get user's current subscription plan
export const getUserSubscription = async (): Promise<UserSubscription | null> => {
  const { userId, has } = await auth();
  if (!userId) return null;

  const supabase = createSupabaseClient();
  
  // Sync subscription first
  await syncUserSubscription();
  
  // Check user's current plan from Clerk
  const planId = getClerkPlanId(has) as PlanId;

  // Get current billing period (first day of current month)
  const currentPeriodStart = new Date();
  currentPeriodStart.setDate(1);
  currentPeriodStart.setHours(0, 0, 0, 0);
  
  const currentPeriodEnd = new Date(currentPeriodStart);
  currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
  currentPeriodEnd.setTime(currentPeriodEnd.getTime() - 1);

  // Get voice minutes used this month
  const { data: sessions, error } = await supabase
    .from('session_usage')
    .select('duration_minutes')
    .eq('user_id', userId)
    .gte('start_time', currentPeriodStart.toISOString())
    .lte('start_time', currentPeriodEnd.toISOString());

  if (error) {
    console.error('Error fetching session usage:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    // Return default values if query fails (this is normal for new users)
    // Note: We still continue with default values to handle new users gracefully
  }

  const voiceMinutesUsed = sessions?.reduce((total, session) => total + session.duration_minutes, 0) || 0;
  const voiceMinutesLimit = getPlanFeatures(planId).voiceMinutes;

  return {
    userId,
    planId,
    voiceMinutesUsed,
    voiceMinutesLimit,
    currentPeriodStart,
    currentPeriodEnd,
  };
};

// Check if user can create a new companion
export const canCreateCompanion = async (): Promise<boolean> => {
  const { userId, has } = await auth();
  if (!userId) return false;

  const supabase = createSupabaseClient();
  
  // Get max tutors from Clerk
  const maxTutors = getMaxTutorsFromClerk(has);
  
  // If unlimited tutors (maxTutors = -1), always allow
  if (maxTutors === -1) {
    return true;
  }

  // Count current companions
  const { data, error } = await supabase
    .from('tutors')
    .select('id', { count: 'exact' })
    .eq('author', userId);

  if (error) {
    console.error('Error checking companion count:', error);
    return false;
  }

  const currentCount = data?.length || 0;
  return currentCount < maxTutors;
};

// Check if user can start a new voice session
export const canStartVoiceSession = async (): Promise<{
  canStart: boolean;
  reason?: string;
  minutesRemaining?: number;
}> => {
  try {
    const subscription = await getUserSubscription();
    if (!subscription) {
      console.log('No subscription found for voice session');
      return { canStart: false, reason: 'No subscription found' };
    }

    console.log('Voice session check:', {
      voiceMinutesUsed: subscription.voiceMinutesUsed,
      voiceMinutesLimit: subscription.voiceMinutesLimit,
      planId: subscription.planId
    });

    const minutesRemaining = subscription.voiceMinutesLimit - subscription.voiceMinutesUsed;
    
    if (minutesRemaining <= 0) {
      console.log('Voice minute limit exceeded');
      return { 
        canStart: false, 
        reason: 'Voice minute limit exceeded',
        minutesRemaining: 0
      };
    }

    console.log('Voice session can start, minutes remaining:', minutesRemaining);
    return { 
      canStart: true, 
      minutesRemaining 
    };
  } catch (error) {
    console.error('Error checking voice session permissions:', error);
    return { 
      canStart: false, 
      reason: `Permission check failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

// Get maximum session duration for user's plan
export const getMaxSessionDuration = async (): Promise<number> => {
  const { userId, has } = await auth();
  if (!userId) return 0;

  return getMaxSessionDurationFromClerk(has);
};

// Record a voice session
export const recordVoiceSession = async (
  tutorId: string, 
  durationMinutes: number, 
  startTime: Date, 
  endTime: Date
): Promise<SessionUsage> => {
  const { userId } = await auth();
  if (!userId) throw new Error('User not authenticated');

  const subscription = await getUserSubscription();
  if (!subscription) throw new Error('No subscription found');

  const supabase = createSupabaseClient();
  
  // Calculate cost for this session
  const { totalCost } = calculateUsageCost(
    subscription.planId, 
    subscription.voiceMinutesUsed + durationMinutes
  );
  
  // Calculate incremental cost for this session
  const previousCost = calculateUsageCost(subscription.planId, subscription.voiceMinutesUsed).totalCost;
  const sessionCost = totalCost - previousCost;

  // Insert session record
  const { data, error } = await supabase
    .from('session_usage')
    .insert({
      user_id: userId,
      tutor_id: tutorId,
      duration_minutes: durationMinutes,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      cost: sessionCost,
    })
    .select()
    .single();

  if (error) {
    console.error('Error recording session:', error);
    console.error('Session data:', {
      user_id: userId,
      tutor_id: tutorId,
      duration_minutes: durationMinutes,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      cost: sessionCost,
    });
    throw new Error(`Failed to record session: ${error.message}`);
  }

  return {
    sessionId: data.id,
    userId,
    tutorId,
    durationMinutes,
    startTime,
    endTime,
    cost: sessionCost,
  };
};

// Get user's usage analytics
export const getUserUsageAnalytics = async () => {
  const subscription = await getUserSubscription();
  if (!subscription) return null;

  const supabase = createSupabaseClient();
  
  // Get sessions for current month
  const { data: sessions, error } = await supabase
    .from('session_usage')
    .select('*')
    .eq('user_id', subscription.userId)
    .gte('start_time', subscription.currentPeriodStart.toISOString())
    .lte('start_time', subscription.currentPeriodEnd.toISOString())
    .order('start_time', { ascending: false });

  if (error) {
    console.error('Error fetching usage analytics:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    // Continue with empty sessions array to handle new users gracefully
  }

  // Calculate billing information
  const billing = calculateUsageCost(subscription.planId, subscription.voiceMinutesUsed);
  const plan = getPlanById(subscription.planId);

  return {
    subscription,
    sessions: sessions || [],
    billing,
    plan,
    usage: {
      voiceMinutesUsed: subscription.voiceMinutesUsed,
      voiceMinutesLimit: subscription.voiceMinutesLimit,
      usagePercentage: (subscription.voiceMinutesUsed / subscription.voiceMinutesLimit) * 100,
      remainingMinutes: subscription.voiceMinutesLimit - subscription.voiceMinutesUsed,
      isOverLimit: subscription.voiceMinutesUsed > subscription.voiceMinutesLimit,
    },
  };
};

// Get historical usage data for charts
export const getHistoricalUsageData = async (months: number = 6) => {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createSupabaseClient();
  
  // Calculate date range for historical data
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  const { data: sessions, error } = await supabase
    .from('session_usage')
    .select('duration_minutes, cost, start_time, tutor_id')
    .eq('user_id', userId)
    .gte('start_time', startDate.toISOString())
    .lte('start_time', endDate.toISOString())
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching historical usage:', error);
    return null;
  }

  // Group sessions by month
  const monthlyData: { [key: string]: { usage: number; cost: number; sessions: number; month: string } } = {};
  
  sessions?.forEach(session => {
    const date = new Date(session.start_time);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { usage: 0, cost: 0, sessions: 0, month: monthName };
    }
    
    monthlyData[monthKey].usage += session.duration_minutes;
    monthlyData[monthKey].cost += session.cost;
    monthlyData[monthKey].sessions += 1;
  });

  // Convert to array and ensure all months are represented
  const result = [];
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    result.push(monthlyData[monthKey] || { usage: 0, cost: 0, sessions: 0, month: monthName });
  }

  return result;
};

// Get detailed session history with filtering
export const getDetailedSessionHistory = async (
  page: number = 1,
  limit: number = 20,
  tutorId?: string,
  startDate?: Date,
  endDate?: Date
) => {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createSupabaseClient();
  
  let query = supabase
    .from('session_usage')
    .select(`
      *,
      tutors:tutor_id (
        id,
        name,
        subject,
        topic
      )
    `)
    .eq('user_id', userId);

  // Apply filters
  if (tutorId) {
    query = query.eq('tutor_id', tutorId);
  }
  if (startDate) {
    query = query.gte('start_time', startDate.toISOString());
  }
  if (endDate) {
    query = query.lte('start_time', endDate.toISOString());
  }

  // Add pagination and ordering
  query = query
    .order('start_time', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  const { data: sessions, error, count } = await query;

  if (error) {
    console.error('Error fetching detailed session history:', error);
    return null;
  }

  return {
    sessions: sessions || [],
    totalCount: count || 0,
    hasMore: (count || 0) > page * limit
  };
};

// Get usage trends and insights
export const getUsageTrends = async () => {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createSupabaseClient();
  
  // Get last 30 days of data
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { data: recentSessions, error } = await supabase
    .from('session_usage')
    .select(`
      duration_minutes,
      cost,
      start_time,
      tutors:tutor_id (
        subject,
        topic
      )
    `)
    .eq('user_id', userId)
    .gte('start_time', thirtyDaysAgo.toISOString())
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching usage trends:', error);
    return null;
  }

  if (!recentSessions || recentSessions.length === 0) {
    return {
      dailyUsage: [],
      subjectBreakdown: [],
      averageSessionLength: 0,
      totalSessions: 0,
      peakUsageDays: []
    };
  }

  // Group by day for daily usage chart
  const dailyUsage: { [key: string]: { date: string; usage: number; sessions: number } } = {};
  
  // Subject breakdown
  const subjectBreakdown: { [key: string]: { subject: string; usage: number; sessions: number } } = {};
  
  let totalDuration = 0;
  
  recentSessions.forEach(session => {
    const date = new Date(session.start_time);
    const dateKey = date.toISOString().split('T')[0];
    const dateDisplay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Daily usage
    if (!dailyUsage[dateKey]) {
      dailyUsage[dateKey] = { date: dateDisplay, usage: 0, sessions: 0 };
    }
    dailyUsage[dateKey].usage += session.duration_minutes;
    dailyUsage[dateKey].sessions += 1;
    
    // Subject breakdown
    const subject = session.tutors?.subject || 'Unknown';
    if (!subjectBreakdown[subject]) {
      subjectBreakdown[subject] = { subject, usage: 0, sessions: 0 };
    }
    subjectBreakdown[subject].usage += session.duration_minutes;
    subjectBreakdown[subject].sessions += 1;
    
    totalDuration += session.duration_minutes;
  });

  // Convert to arrays
  const dailyUsageArray = Object.values(dailyUsage);
  const subjectBreakdownArray = Object.values(subjectBreakdown);
  
  // Calculate insights
  const averageSessionLength = totalDuration / recentSessions.length;
  const peakUsageDays = dailyUsageArray
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 3);

  return {
    dailyUsage: dailyUsageArray,
    subjectBreakdown: subjectBreakdownArray,
    averageSessionLength,
    totalSessions: recentSessions.length,
    peakUsageDays
  };
};