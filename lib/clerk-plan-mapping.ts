// Clerk Plan and Feature Mapping
export const CLERK_PLAN_MAPPING = {
  // Plan IDs (must match Clerk dashboard)
  PLANS: {
    FREE: 'free',
    ACTIVE_LEARNER: 'active_learner', 
    TUTOR_PRO: 'tutor_pro',
  },
  
  // Feature IDs (must match Clerk dashboard)
  FEATURES: {
    // Voice Minutes
    VOICE_10_MINS: 'voice_10_mins',
    VOICE_60_MINS: 'voice_60_mins',
    VOICE_150_MINS: 'voice_150_mins',
    
    // Tutor Limits
    SINGLE_TUTOR: 'single_tutor',
    THREE_TUTORS: 'three_tutors',
    TEN_TUTORS: 'ten_tutors',
    
    // Session Duration
    TWO_MIN_SESSIONS: 'two_min_sessions',
    TEN_MIN_SESSIONS: 'ten_min_sessions',
    TWENTY_MIN_SESSIONS: 'twenty_min_sessions',
    
    // Premium Features
    CHAT_HISTORY: 'chat_history',
    FASTER_SUPPORT: 'faster_support',
    NEW_FEATURES: 'new_features',
    USAGE_STATS: 'usage_stats',
  },
} as const;

// Helper function to get plan ID from Clerk auth
export const getClerkPlanId = (has: any): string => {
  if (has({ plan: CLERK_PLAN_MAPPING.PLANS.TUTOR_PRO })) {
    return 'TUTOR_PRO';
  } else if (has({ plan: CLERK_PLAN_MAPPING.PLANS.ACTIVE_LEARNER })) {
    return 'ACTIVE_LEARNER';
  } else {
    return 'FREE';
  }
};

// Helper function to check specific features
export const hasClerkFeature = (has: any, feature: keyof typeof CLERK_PLAN_MAPPING.FEATURES): boolean => {
  return has({ feature: CLERK_PLAN_MAPPING.FEATURES[feature] });
};

// Helper function to get max tutors based on plan/features
export const getMaxTutorsFromClerk = (has: any): number => {
  if (has({ plan: CLERK_PLAN_MAPPING.PLANS.TUTOR_PRO }) || 
      hasClerkFeature(has, 'TEN_TUTORS')) {
    return -1; // unlimited
  } else if (has({ plan: CLERK_PLAN_MAPPING.PLANS.ACTIVE_LEARNER }) || 
             hasClerkFeature(has, 'THREE_TUTORS')) {
    return 3;
  } else {
    return 1; // free plan
  }
};

// Helper function to get voice minutes based on plan/features
export const getVoiceMinutesFromClerk = (has: any): number => {
  if (has({ plan: CLERK_PLAN_MAPPING.PLANS.TUTOR_PRO }) || 
      hasClerkFeature(has, 'VOICE_150_MINS')) {
    return 150;
  } else if (has({ plan: CLERK_PLAN_MAPPING.PLANS.ACTIVE_LEARNER }) || 
             hasClerkFeature(has, 'VOICE_60_MINS')) {
    return 60;
  } else {
    return 10; // free plan
  }
};

// Helper function to get max session duration based on plan/features
export const getMaxSessionDurationFromClerk = (has: any): number => {
  if (has({ plan: CLERK_PLAN_MAPPING.PLANS.TUTOR_PRO }) || 
      hasClerkFeature(has, 'TWENTY_MIN_SESSIONS')) {
    return 20;
  } else if (has({ plan: CLERK_PLAN_MAPPING.PLANS.ACTIVE_LEARNER }) || 
             hasClerkFeature(has, 'TEN_MIN_SESSIONS')) {
    return 10;
  } else {
    return 2; // free plan
  }
};