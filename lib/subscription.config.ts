export const VAPI_COSTS = {
  PAY_AS_YOU_GO_RATE: 0.20, // $0.20 per minute
  AGENCY_RATE: 0.167, // $0.167 per minute with agency plan
  OVERAGE_RATE: 0.18, // $0.18 per minute for overage
} as const;

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    billingPeriod: 'month',
    features: {
      voiceMinutes: 10,
      maxTutors: 1,
      maxSessionDuration: 2, // minutes
      concurrentSessions: 1,
      sessionHistory: false,
      prioritySupport: false,
      earlyAccess: false,
    },
    costs: {
      voiceMinutesCost: 10 * VAPI_COSTS.PAY_AS_YOU_GO_RATE, // $2.00
      profitMargin: -2.00, // Loss leader
    },
  },
  ACTIVE_LEARNER: {
    id: 'active_learner',
    name: 'Active Learner',
    price: 25,
    billingPeriod: 'month',
    features: {
      voiceMinutes: 60,
      maxTutors: 3,
      maxSessionDuration: 10, // minutes
      concurrentSessions: 2,
      sessionHistory: true,
      prioritySupport: false,
      earlyAccess: false,
    },
    costs: {
      voiceMinutesCost: 60 * VAPI_COSTS.PAY_AS_YOU_GO_RATE, // $12.00
      profitMargin: 25 - (60 * VAPI_COSTS.PAY_AS_YOU_GO_RATE), // $13.00 (52% margin)
    },
  },
  TUTOR_PRO: {
    id: 'tutor_pro',
    name: 'Tutor Pro+',
    price: 59,
    billingPeriod: 'month',
    features: {
      voiceMinutes: 150,
      maxTutors: -1, // unlimited
      maxSessionDuration: 20, // minutes
      concurrentSessions: 5,
      sessionHistory: true,
      prioritySupport: true,
      earlyAccess: true,
    },
    costs: {
      voiceMinutesCost: 150 * VAPI_COSTS.PAY_AS_YOU_GO_RATE, // $30.00
      profitMargin: 59 - (150 * VAPI_COSTS.PAY_AS_YOU_GO_RATE), // $29.00 (49% margin)
    },
  },
} as const;

export const OVERAGE_RATES = {
  FREE: VAPI_COSTS.PAY_AS_YOU_GO_RATE + 0.05, // $0.25 per minute
  ACTIVE_LEARNER: VAPI_COSTS.PAY_AS_YOU_GO_RATE + 0.02, // $0.22 per minute
  TUTOR_PRO: VAPI_COSTS.PAY_AS_YOU_GO_RATE + 0.02, // $0.22 per minute
} as const;

export type PlanId = keyof typeof SUBSCRIPTION_PLANS;
export type PlanFeatures = typeof SUBSCRIPTION_PLANS[PlanId]['features'];
export type PlanCosts = typeof SUBSCRIPTION_PLANS[PlanId]['costs'];

export const getPlanById = (planId: PlanId) => {
  return SUBSCRIPTION_PLANS[planId];
};

export const getPlanFeatures = (planId: PlanId): PlanFeatures => {
  return SUBSCRIPTION_PLANS[planId].features;
};

export const getPlanCosts = (planId: PlanId): PlanCosts => {
  return SUBSCRIPTION_PLANS[planId].costs;
};

export const getOverageRate = (planId: PlanId): number => {
  switch (planId) {
    case 'FREE':
      return OVERAGE_RATES.FREE;
    case 'ACTIVE_LEARNER':
      return OVERAGE_RATES.ACTIVE_LEARNER;
    case 'TUTOR_PRO':
      return OVERAGE_RATES.TUTOR_PRO;
    default:
      return VAPI_COSTS.PAY_AS_YOU_GO_RATE;
  }
};

export const calculateUsageCost = (
  planId: PlanId,
  voiceMinutesUsed: number
): { baseCost: number; overageCost: number; totalCost: number } => {
  const plan = getPlanById(planId);
  const includedMinutes = plan.features.voiceMinutes;
  const overageRate = getOverageRate(planId);
  
  const baseCost = plan.price;
  const overageMinutes = Math.max(0, voiceMinutesUsed - includedMinutes);
  const overageCost = overageMinutes * overageRate;
  const totalCost = baseCost + overageCost;
  
  return {
    baseCost,
    overageCost,
    totalCost,
  };
};