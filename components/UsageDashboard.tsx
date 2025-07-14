import { Clock, TrendingUp, Users, AlertCircle } from "lucide-react";
import { getUserUsageAnalytics } from "@/lib/actions/subscription.actions";
import { formatDistanceToNow } from "date-fns";

export const UsageDashboard = async () => {
  const analytics = await getUserUsageAnalytics();
  
  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">Unable to load usage analytics</p>
        </div>
      </div>
    );
  }

  const { subscription, sessions, billing, plan, usage } = analytics;

  return (
    <div className="space-y-6">
      {/* Usage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Voice Minutes Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Voice Minutes</h3>
            </div>
            {usage.isOverLimit && (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
          
          <div className="mb-4">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">
                {usage.voiceMinutesUsed.toFixed(1)}
              </span>
              <span className="text-gray-500 ml-2">
                / {usage.voiceMinutesLimit} min
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {usage.remainingMinutes > 0 
                ? `${usage.remainingMinutes.toFixed(1)} minutes remaining`
                : `${Math.abs(usage.remainingMinutes).toFixed(1)} minutes over limit`
              }
            </p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                usage.isOverLimit ? 'bg-red-500' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(100, usage.usagePercentage)}%` }}
            />
          </div>
        </div>

        {/* Billing Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Current Bill</h3>
          </div>
          
          <div className="mb-4">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">
                ${billing.totalCost.toFixed(2)}
              </span>
              <span className="text-gray-500 ml-2">this month</span>
            </div>
            <div className="text-sm text-gray-600 mt-1 space-y-1">
              <div className="flex justify-between">
                <span>Base plan:</span>
                <span>${billing.baseCost.toFixed(2)}</span>
              </div>
              {billing.overageCost > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Overage:</span>
                  <span>${billing.overageCost.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-600">Plan:</span>
            <span className="text-sm font-medium text-gray-900">
              {plan.name}
            </span>
          </div>
        </div>

        {/* Sessions Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Sessions</h3>
          </div>
          
          <div className="mb-4">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">
                {sessions.length}
              </span>
              <span className="text-gray-500 ml-2">this month</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {sessions.length > 0 
                ? `Average: ${(usage.voiceMinutesUsed / sessions.length).toFixed(1)} min/session`
                : 'No sessions yet'
              }
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-600">Max duration:</span>
            <span className="text-sm font-medium text-gray-900">
              {plan.features.maxSessionDuration} min
            </span>
          </div>
        </div>
      </div>

      {/* Usage Warnings */}
      {usage.usagePercentage > 80 && (
        <div className={`rounded-lg p-4 ${
          usage.isOverLimit 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center">
            <AlertCircle className={`w-5 h-5 mr-2 ${
              usage.isOverLimit ? 'text-red-600' : 'text-yellow-600'
            }`} />
            <div>
              <h4 className={`font-semibold ${
                usage.isOverLimit ? 'text-red-800' : 'text-yellow-800'
              }`}>
                {usage.isOverLimit ? 'Usage Limit Exceeded' : 'Usage Warning'}
              </h4>
              <p className={`text-sm ${
                usage.isOverLimit ? 'text-red-700' : 'text-yellow-700'
              }`}>
                {usage.isOverLimit 
                  ? `You've exceeded your monthly limit by ${Math.abs(usage.remainingMinutes).toFixed(1)} minutes. Additional charges apply.`
                  : `You've used ${usage.usagePercentage.toFixed(1)}% of your monthly voice minutes. Consider upgrading if you need more.`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Sessions
        </h3>
        
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No sessions yet this month</p>
            <p className="text-sm">Start a conversation with your AI tutor to begin!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {session.duration_minutes.toFixed(1)} minutes
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(session.start_time), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    ${session.cost.toFixed(3)}
                  </p>
                </div>
              </div>
            ))}
            
            {sessions.length > 5 && (
              <div className="text-center pt-2">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View all {sessions.length} sessions
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Billing Period */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Billing Period
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current period</p>
            <p className="text-lg font-medium text-gray-900">
              {subscription.currentPeriodStart.toLocaleDateString()} - {subscription.currentPeriodEnd.toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Resets in</p>
            <p className="text-lg font-medium text-gray-900">
              {formatDistanceToNow(subscription.currentPeriodEnd)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};