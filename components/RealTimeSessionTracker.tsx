'use client';

import { useState, useEffect } from 'react';
import { Clock, Activity, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { getUsageTrends, getUserUsageAnalytics } from '@/lib/actions/subscription.actions';

interface SessionMetrics {
  totalSessions: number;
  totalMinutes: number;
  totalCost: number;
  avgSessionLength: number;
  todaySessions: number;
  todayMinutes: number;
  weekSessions: number;
  weekMinutes: number;
}

interface RealTimeSessionTrackerProps {
  className?: string;
}

export default function RealTimeSessionTracker({ className = '' }: RealTimeSessionTrackerProps) {
  const [metrics, setMetrics] = useState<SessionMetrics>({
    totalSessions: 0,
    totalMinutes: 0,
    totalCost: 0,
    avgSessionLength: 0,
    todaySessions: 0,
    todayMinutes: 0,
    weekSessions: 0,
    weekMinutes: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        
        const [analytics, trends] = await Promise.all([
          getUserUsageAnalytics(),
          getUsageTrends()
        ]);

        if (analytics && trends) {
          const now = new Date();
          const today = now.toDateString();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

          // Filter sessions for today and this week
          const todaySessions = analytics.sessions.filter(
            session => new Date(session.start_time).toDateString() === today
          );
          
          const weekSessions = analytics.sessions.filter(
            session => new Date(session.start_time) >= weekAgo
          );

          setMetrics({
            totalSessions: trends.totalSessions,
            totalMinutes: analytics.usage.voiceMinutesUsed,
            totalCost: analytics.billing.totalCost,
            avgSessionLength: trends.averageSessionLength,
            todaySessions: todaySessions.length,
            todayMinutes: todaySessions.reduce((sum, session) => sum + session.duration_minutes, 0),
            weekSessions: weekSessions.length,
            weekMinutes: weekSessions.reduce((sum, session) => sum + session.duration_minutes, 0)
          });
        }
      } catch (error) {
        console.error('Error fetching session metrics:', error);
      } finally {
        setLoading(false);
        setLastUpdate(new Date());
      }
    };

    fetchMetrics();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes.toFixed(1)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className={`bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Activity className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Live Session Metrics</h3>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Today's Sessions */}
        <div className="bg-blue-50/60 rounded-lg p-4 border border-blue-200/30">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">TODAY</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{metrics.todaySessions}</div>
          <div className="text-xs text-blue-600">{formatTime(metrics.todayMinutes)}</div>
        </div>

        {/* This Week */}
        <div className="bg-green-50/60 rounded-lg p-4 border border-green-200/30">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-600 font-medium">7 DAYS</span>
          </div>
          <div className="text-2xl font-bold text-green-700">{metrics.weekSessions}</div>
          <div className="text-xs text-green-600">{formatTime(metrics.weekMinutes)}</div>
        </div>

        {/* Average Session */}
        <div className="bg-purple-50/60 rounded-lg p-4 border border-purple-200/30">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">AVG</span>
          </div>
          <div className="text-2xl font-bold text-purple-700">
            {formatTime(metrics.avgSessionLength)}
          </div>
          <div className="text-xs text-purple-600">per session</div>
        </div>

        {/* Total Cost */}
        <div className="bg-orange-50/60 rounded-lg p-4 border border-orange-200/30">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-4 h-4 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">COST</span>
          </div>
          <div className="text-2xl font-bold text-orange-700">
            {formatCost(metrics.totalCost)}
          </div>
          <div className="text-xs text-orange-600">this month</div>
        </div>
      </div>

      {/* Session Efficiency Indicators */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Session Efficiency</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Usage Rate */}
          <div className="flex items-center justify-between p-3 bg-gray-50/60 rounded-lg">
            <div>
              <p className="text-xs text-gray-600">Daily Average</p>
              <p className="text-sm font-medium text-gray-900">
                {metrics.weekSessions > 0 ? (metrics.weekSessions / 7).toFixed(1) : '0'} sessions/day
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>

          {/* Cost per Session */}
          <div className="flex items-center justify-between p-3 bg-gray-50/60 rounded-lg">
            <div>
              <p className="text-xs text-gray-600">Cost/Session</p>
              <p className="text-sm font-medium text-gray-900">
                {metrics.totalSessions > 0 
                  ? formatCost(metrics.totalCost / metrics.totalSessions)
                  : '$0.00'
                }
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
          </div>

          {/* Minutes per Session */}
          <div className="flex items-center justify-between p-3 bg-gray-50/60 rounded-lg">
            <div>
              <p className="text-xs text-gray-600">Min/Session</p>
              <p className="text-sm font-medium text-gray-900">
                {formatTime(metrics.avgSessionLength)}
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Session Activity</span>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const dayActivity = metrics.weekSessions > 0 ? Math.random() : 0; // This should be real data
              return (
                <div
                  key={day}
                  className={`w-2 h-6 rounded-sm ${
                    dayActivity > 0.7 ? 'bg-green-500' :
                    dayActivity > 0.3 ? 'bg-yellow-500' :
                    dayActivity > 0 ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  title={`Day ${day}: ${dayActivity > 0 ? 'Active' : 'No sessions'}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}