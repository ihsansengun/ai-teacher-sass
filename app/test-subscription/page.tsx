import { canCreateCompanion, getUserSubscription, getMaxSessionDuration } from "@/lib/actions/subscription.actions";

const TestSubscriptionLogic = async () => {
  try {
    const subscription = await getUserSubscription();
    const canCreate = await canCreateCompanion();
    const maxDuration = await getMaxSessionDuration();

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🧪 Subscription Logic Test
          </h1>

          <div className="space-y-6">
            {/* Subscription Data */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                User Subscription
              </h2>
              {subscription ? (
                <div className="space-y-2">
                  <p><strong>Plan:</strong> {subscription.planId}</p>
                  <p><strong>Voice Minutes Used:</strong> {subscription.voiceMinutesUsed}</p>
                  <p><strong>Voice Minutes Limit:</strong> {subscription.voiceMinutesLimit}</p>
                  <p><strong>Period Start:</strong> {subscription.currentPeriodStart.toLocaleDateString()}</p>
                  <p><strong>Period End:</strong> {subscription.currentPeriodEnd.toLocaleDateString()}</p>
                </div>
              ) : (
                <p className="text-red-600">❌ No subscription data found</p>
              )}
            </div>

            {/* Companion Creation Test */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Companion Creation
              </h2>
              <p className={`text-lg ${canCreate ? 'text-green-600' : 'text-red-600'}`}>
                {canCreate ? '✅ Can create companion' : '❌ Cannot create companion (limit reached)'}
              </p>
            </div>

            {/* Session Duration Test */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Session Duration
              </h2>
              <p className="text-lg text-blue-600">
                📞 Max session duration: {maxDuration} minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-red-600 mb-8">
            ❌ Error Testing Subscription Logic
          </h1>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <pre className="text-red-600">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </div>
        </div>
      </div>
    );
  }
};

export default TestSubscriptionLogic;