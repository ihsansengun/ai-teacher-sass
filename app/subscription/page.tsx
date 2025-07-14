import { PricingCard } from "@/components/PricingCard";
import { SubscriptionTest } from "@/components/SubscriptionTest";
import { SUBSCRIPTION_PLANS, PlanId } from "@/lib/subscription.config";
import { getUserSubscription } from "@/lib/actions/subscription.actions";

const Subscription = async () => {
    const subscription = await getUserSubscription();
    const currentPlanId = subscription?.planId || 'FREE';

    const handleSubscribe = (planId: PlanId) => {
        // This will be implemented with Clerk's subscription flow
        console.log('Subscribing to plan:', planId);
    };

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Choose Your Learning Plan
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Select a plan for your AI tutoring needs. <strong>Time-based pricing</strong> includes 
                        voice conversation minutes and advanced features.
                    </p>
                </div>

                {/* Test Component */}
                <div className="mb-8">
                    <SubscriptionTest />
                </div>

                {/* Current Usage Display */}
                {subscription && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 max-w-md mx-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Current Usage
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Voice Minutes Used:</span>
                                <span className="text-sm font-medium">
                                    {subscription.voiceMinutesUsed}/{subscription.voiceMinutesLimit}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ 
                                        width: `${Math.min(100, (subscription.voiceMinutesUsed / subscription.voiceMinutesLimit) * 100)}%` 
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Billing Period:</span>
                                <span>
                                    {subscription.currentPeriodStart.toLocaleDateString()} - {subscription.currentPeriodEnd.toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <PricingCard 
                        planId="FREE" 
                        isCurrentPlan={currentPlanId === 'FREE'}
                        onSubscribe={handleSubscribe}
                    />
                    <PricingCard 
                        planId="ACTIVE_LEARNER" 
                        isCurrentPlan={currentPlanId === 'ACTIVE_LEARNER'}
                        onSubscribe={handleSubscribe}
                    />
                    <PricingCard 
                        planId="TUTOR_PRO" 
                        isCurrentPlan={currentPlanId === 'TUTOR_PRO'}
                        isPopular={true}
                        onSubscribe={handleSubscribe}
                    />
                </div>

                {/* Feature Comparison */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                        Feature Comparison
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Feature</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Free</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Active Learner</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Tutor Pro+</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100">
                                    <td className="py-3 px-4 text-gray-600">Voice Minutes/Month</td>
                                    <td className="py-3 px-4 text-center">{SUBSCRIPTION_PLANS.FREE.features.voiceMinutes}</td>
                                    <td className="py-3 px-4 text-center">{SUBSCRIPTION_PLANS.ACTIVE_LEARNER.features.voiceMinutes}</td>
                                    <td className="py-3 px-4 text-center">{SUBSCRIPTION_PLANS.TUTOR_PRO.features.voiceMinutes}</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-3 px-4 text-gray-600">Max Tutors</td>
                                    <td className="py-3 px-4 text-center">{SUBSCRIPTION_PLANS.FREE.features.maxTutors}</td>
                                    <td className="py-3 px-4 text-center">{SUBSCRIPTION_PLANS.ACTIVE_LEARNER.features.maxTutors}</td>
                                    <td className="py-3 px-4 text-center">{SUBSCRIPTION_PLANS.TUTOR_PRO.features.maxTutors}</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-3 px-4 text-gray-600">Max Session Duration</td>
                                    <td className="py-3 px-4 text-center">{SUBSCRIPTION_PLANS.FREE.features.maxSessionDuration} min</td>
                                    <td className="py-3 px-4 text-center">{SUBSCRIPTION_PLANS.ACTIVE_LEARNER.features.maxSessionDuration} min</td>
                                    <td className="py-3 px-4 text-center">{SUBSCRIPTION_PLANS.TUTOR_PRO.features.maxSessionDuration} min</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-3 px-4 text-gray-600">Concurrent Sessions</td>
                                    <td className="py-3 px-4 text-center">{SUBSCRIPTION_PLANS.FREE.features.concurrentSessions}</td>
                                    <td className="py-3 px-4 text-center">{SUBSCRIPTION_PLANS.ACTIVE_LEARNER.features.concurrentSessions}</td>
                                    <td className="py-3 px-4 text-center">{SUBSCRIPTION_PLANS.TUTOR_PRO.features.concurrentSessions}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-16 text-center">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-8">
                        Frequently Asked Questions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="text-left">
                            <h4 className="font-semibold text-gray-900 mb-2">
                                What happens if I exceed my voice minutes?
                            </h4>
                            <p className="text-gray-600 text-sm">
                                You'll be charged overage rates based on your plan. Free users pay $0.25/min, 
                                while paid plans have lower overage rates.
                            </p>
                        </div>
                        <div className="text-left">
                            <h4 className="font-semibold text-gray-900 mb-2">
                                Can I change my plan anytime?
                            </h4>
                            <p className="text-gray-600 text-sm">
                                Yes, you can upgrade or downgrade your plan at any time. 
                                Changes take effect immediately.
                            </p>
                        </div>
                        <div className="text-left">
                            <h4 className="font-semibold text-gray-900 mb-2">
                                How is session time calculated?
                            </h4>
                            <p className="text-gray-600 text-sm">
                                Only active voice conversation time is counted. 
                                Pauses and silent periods are not included.
                            </p>
                        </div>
                        <div className="text-left">
                            <h4 className="font-semibold text-gray-900 mb-2">
                                Is there a free trial?
                            </h4>
                            <p className="text-gray-600 text-sm">
                                Yes, the Free plan includes 10 voice minutes per month 
                                so you can try the service risk-free.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Subscription;
