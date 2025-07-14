'use client';

import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export const SubscriptionTest = () => {
  const { userId, has } = useAuth();
  const [planInfo, setPlanInfo] = useState<any>(null);

  useEffect(() => {
    if (userId && has) {
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
          two_min_sessions: has({ feature: 'two_min_sessions' }),
          ten_min_sessions: has({ feature: 'ten_min_sessions' }),
          twenty_min_sessions: has({ feature: 'twenty_min_sessions' }),
          chat_history: has({ feature: 'chat_history' }),
          faster_support: has({ feature: 'faster_support' }),
          new_features: has({ feature: 'new_features' }),
          usage_stats: has({ feature: 'usage_stats' }),
        }
      };
      setPlanInfo(planData);
    }
  }, [userId, has]);

  if (!userId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800">Not Signed In</h3>
        <p className="text-yellow-700">Please sign in to test subscription features.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🧪 Subscription Test Results
      </h3>
      
      {planInfo ? (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">User ID:</h4>
            <p className="text-sm text-gray-600 font-mono">{planInfo.userId}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Active Plans:</h4>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(planInfo.plans).map(([plan, active]) => (
                <div 
                  key={plan} 
                  className={`p-2 rounded text-sm text-center ${
                    active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {plan}: {active ? '✅' : '❌'}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Active Features:</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(planInfo.features).map(([feature, active]) => (
                <div 
                  key={feature} 
                  className={`p-2 rounded text-xs ${
                    active ? 'bg-blue-100 text-blue-800' : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  {feature}: {active ? '✅' : '❌'}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading subscription data...</p>
        </div>
      )}
    </div>
  );
};