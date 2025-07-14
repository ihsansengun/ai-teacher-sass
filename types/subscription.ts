// CreateCompanion moved to index.d.ts to avoid conflicts

export interface GetAllCompanions {
  limit?: number;
  page?: number;
  subject?: string;
  topic?: string;
}

export interface SessionUsage {
  id: string;
  user_id: string;
  tutor_id: string;
  duration_minutes: number;
  start_time: string;
  end_time: string;
  cost: number;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  voice_minutes_used: number;
  voice_minutes_limit: number;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface VoiceSessionPermissions {
  canStart: boolean;
  reason?: string;
  minutesRemaining?: number;
}

export interface UsageAnalytics {
  subscription: UserSubscription;
  sessions: SessionUsage[];
  billing: {
    baseCost: number;
    overageCost: number;
    totalCost: number;
  };
  plan: {
    id: string;
    name: string;
    price: number;
    features: {
      voiceMinutes: number;
      maxTutors: number;
      maxSessionDuration: number;
      concurrentSessions: number;
      sessionHistory: boolean;
      prioritySupport: boolean;
      earlyAccess: boolean;
    };
  };
  usage: {
    voiceMinutesUsed: number;
    voiceMinutesLimit: number;
    usagePercentage: number;
    remainingMinutes: number;
    isOverLimit: boolean;
  };
}