import { auth } from "@clerk/nextjs/server";

const SimpleTest = async () => {
  try {
    const { userId, has } = await auth();
    
    if (!userId) {
      return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              🔒 Not Signed In
            </h1>
            <p>Please sign in to test the subscription system.</p>
          </div>
        </div>
      );
    }

    const planData = {
      userId,
      plans: {
        free: has({ plan: 'free' }),
        active_learner: has({ plan: 'active_learner' }),
        tutor_pro: has({ plan: 'tutor_pro' }),
      },
      features: {
        voice_10_mins: has({ feature: 'voice_10_mins' }),
        voice_60_mins: has({ feature: 'voice_60_mins' }),
        voice_150_mins: has({ feature: 'voice_150_mins' }),
        single_tutor: has({ feature: 'single_tutor' }),
        three_tutors: has({ feature: 'three_tutors' }),
        ten_tutors: has({ feature: 'ten_tutors' }),
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            ✅ Simple Clerk Test
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">User Info</h2>
            <p><strong>User ID:</strong> {planData.userId}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Active Plans</h2>
            <div className="space-y-2">
              {Object.entries(planData.plans).map(([plan, active]) => (
                <div key={plan} className="flex justify-between">
                  <span>{plan}:</span>
                  <span className={active ? 'text-green-600' : 'text-red-600'}>
                    {active ? '✅ Active' : '❌ Not Active'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Active Features</h2>
            <div className="space-y-2">
              {Object.entries(planData.features).map(([feature, active]) => (
                <div key={feature} className="flex justify-between">
                  <span>{feature}:</span>
                  <span className={active ? 'text-green-600' : 'text-red-600'}>
                    {active ? '✅ Active' : '❌ Not Active'}
                  </span>
                </div>
              ))}
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
            ❌ Error in Simple Test
          </h1>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <pre className="text-red-600 whitespace-pre-wrap">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </div>
        </div>
      </div>
    );
  }
};

export default SimpleTest;