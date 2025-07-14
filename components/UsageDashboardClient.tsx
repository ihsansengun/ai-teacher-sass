'use client';

import { useState, useEffect } from "react";
import { Clock, Users, AlertCircle, BarChart3, History } from "lucide-react";
import { getUserUsageAnalytics } from "@/lib/actions/subscription.actions";
import { formatDistanceToNow } from "date-fns";
import AnalyticsDashboard from "./AnalyticsDashboard";
import SessionHistoryTable from "./SessionHistoryTable";

interface AnalyticsData {
  subscription: {
    userId: string;
    planId: string;
    voiceMinutesUsed: number;
    voiceMinutesLimit: number;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  };
  sessions: any[];
  plan: {
    name: string;
  };
  usage: {
    voiceMinutesUsed: number;
    voiceMinutesLimit: number;
    usagePercentage: number;
    remainingMinutes: number;
    isOverLimit: boolean;
  };
}

export default function UsageDashboardClient() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'history'>('overview');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getUserUsageAnalytics();
        if (data) {
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">Unable to load usage analytics</p>
        </div>
      </div>
    );
  }

  const { subscription, sessions, plan, usage } = analytics;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100/50 backdrop-blur-sm p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Usage Overview', icon: Clock },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'history', label: 'Session History', icon: History }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Usage Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Voice Minutes Card */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-white/20">
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

              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    usage.isOverLimit ? 'bg-red-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${Math.min(100, usage.usagePercentage)}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-sm text-gray-600">
                <span>Plan: {plan.name}</span>
                <span>Usage: {usage.usagePercentage.toFixed(1)}%</span>
              </div>
            </div>

            {/* Sessions Card */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <Users className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Sessions This Month</h3>
              </div>
              
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    {sessions.length}
                  </span>
                  <span className="text-gray-500 ml-2">sessions</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {sessions.length > 0 
                    ? `Average: ${(usage.voiceMinutesUsed / sessions.length).toFixed(1)} min/session`
                    : 'No sessions yet'
                  }
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-sm text-gray-600">
                <span>Total minutes: {usage.voiceMinutesUsed.toFixed(1)}</span>
                <span>This period</span>
              </div>
            </div>
          </div>

          {/* Usage Warning */}
          {usage.usagePercentage > 80 && (
            <div className={`rounded-xl p-4 border ${
              usage.isOverLimit 
                ? 'bg-red-50/60 border-red-200' 
                : 'bg-yellow-50/60 border-yellow-200'
            }`}>
              <div className="flex items-center">
                <AlertCircle className={`w-5 h-5 mr-2 ${
                  usage.isOverLimit ? 'text-red-600' : 'text-yellow-600'
                }`} />
                <div>
                  <h4 className={`font-semibold ${
                    usage.isOverLimit ? 'text-red-800' : 'text-yellow-800'
                  }`}>
                    {usage.isOverLimit ? 'Usage Limit Exceeded' : 'High Usage Warning'}
                  </h4>
                  <p className={`text-sm ${
                    usage.isOverLimit ? 'text-red-700' : 'text-yellow-700'
                  }`}>
                    {usage.isOverLimit 
                      ? `You&apos;ve used all your monthly voice minutes. Please upgrade your plan to continue.`
                      : `You&apos;ve used ${usage.usagePercentage.toFixed(1)}% of your monthly voice minutes.`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Sessions */}
          {sessions.length > 0 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Sessions
              </h3>
              
              <div className="space-y-3">
                {sessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-white/40 rounded-lg border border-white/20">
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
                  </div>
                ))}
                
                {sessions.length > 3 && (
                  <div className="text-center pt-2">
                    <button 
                      onClick={() => setActiveTab('history')}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View all {sessions.length} sessions
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Usage Period */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Current Usage Period
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Period</p>
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
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && <AnalyticsDashboard />}

      {/* History Tab */}
      {activeTab === 'history' && <SessionHistoryTable />}

    </div>
  );
}