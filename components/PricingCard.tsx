import { Check } from "lucide-react";
import { SUBSCRIPTION_PLANS, PlanId } from "@/lib/subscription.config";

interface PricingCardProps {
  planId: PlanId;
  isCurrentPlan?: boolean;
  isPopular?: boolean;
  onSubscribe?: (planId: PlanId) => void;
}

export const PricingCard = ({ 
  planId, 
  isCurrentPlan = false, 
  isPopular = false,
  onSubscribe 
}: PricingCardProps) => {
  const plan = SUBSCRIPTION_PLANS[planId];
  
  const features = [
    {
      name: `${plan.features.voiceMinutes} Voice Minutes`,
      description: `${plan.features.voiceMinutes} minutes of AI tutoring per month`,
      included: true,
    },
    {
      name: `${plan.features.maxTutors === -1 ? 'Unlimited' : plan.features.maxTutors} Active Tutors`,
      description: `Create up to ${plan.features.maxTutors === -1 ? 'unlimited' : plan.features.maxTutors} AI tutors`,
      included: true,
    },
    {
      name: `${plan.features.maxSessionDuration} Min Sessions`,
      description: `Maximum ${plan.features.maxSessionDuration} minutes per session`,
      included: true,
    },
    {
      name: `${plan.features.concurrentSessions} Concurrent Sessions`,
      description: `Run ${plan.features.concurrentSessions} sessions simultaneously`,
      included: true,
    },
    {
      name: "Session History",
      description: "Access your previous learning sessions",
      included: plan.features.sessionHistory,
    },
    {
      name: "Priority Support",
      description: "Get faster response times for support",
      included: plan.features.prioritySupport,
    },
    {
      name: "Early Access",
      description: "Try new features before general release",
      included: plan.features.earlyAccess,
    },
  ];

  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe(planId);
    }
  };

  return (
    <div className={`relative rounded-2xl p-8 ${
      isPopular 
        ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200' 
        : 'bg-white border border-gray-200'
    } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute -top-4 right-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Current Plan
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {plan.name}
        </h3>
        <div className="flex items-baseline mb-2">
          <span className="text-4xl font-bold text-gray-900">
            ${plan.price}
          </span>
          <span className="text-gray-500 ml-2">
            /{plan.billingPeriod}
          </span>
        </div>
        
        {planId === 'FREE' && (
          <p className="text-sm text-gray-600">Always free</p>
        )}
        
        {planId !== 'FREE' && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <input 
              type="checkbox" 
              className="mr-2 rounded" 
              disabled 
            />
            <span>Billed annually</span>
          </div>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <Check 
              className={`w-5 h-5 mr-3 mt-0.5 ${
                feature.included ? 'text-green-500' : 'text-gray-300'
              }`}
            />
            <div>
              <span className={`text-sm font-medium ${
                feature.included ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {feature.name}
              </span>
              {feature.description && (
                <p className="text-xs text-gray-500 mt-1">
                  {feature.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-6">
        <div className="text-xs text-gray-600">
          <strong>Cost Analysis:</strong>
        </div>
        <div className="text-xs text-gray-500">
          Voice API Cost: ${plan.costs.voiceMinutesCost.toFixed(2)}/month
        </div>
        <div className="text-xs text-gray-500">
          Profit Margin: ${plan.costs.profitMargin.toFixed(2)}/month
        </div>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={isCurrentPlan}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
          isCurrentPlan
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : isPopular
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
            : 'bg-gray-900 hover:bg-gray-800 text-white'
        }`}
      >
        {isCurrentPlan ? 'Current Plan' : 'Subscribe'}
      </button>
      
      {planId !== 'FREE' && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Overage: ${(plan.costs.voiceMinutesCost / plan.features.voiceMinutes + 0.02).toFixed(2)}/minute
        </p>
      )}
    </div>
  );
};