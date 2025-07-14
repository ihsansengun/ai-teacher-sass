'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  getHistoricalUsageData, 
  getUsageTrends, 
  getDetailedSessionHistory 
} from '@/lib/actions/subscription.actions';
import { subjectsColors } from '@/constants';

interface HistoricalData {
  usage: number;
  cost: number;
  sessions: number;
  month: string;
}

interface TrendsData {
  dailyUsage: { date: string; usage: number; sessions: number }[];
  subjectBreakdown: { subject: string; usage: number; sessions: number }[];
  averageSessionLength: number;
  totalSessions: number;
  peakUsageDays: { date: string; usage: number; sessions: number }[];
}

interface SessionHistoryItem {
  id: string;
  duration_minutes: number;
  cost: number;
  start_time: string;
  tutors: {
    name: string;
    subject: string;
    topic: string;
  };
}

export default function AnalyticsDashboard() {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'history'>('overview');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        const [historical, trends, history] = await Promise.all([
          getHistoricalUsageData(6),
          getUsageTrends(),
          getDetailedSessionHistory(1, 10)
        ]);

        if (historical) setHistoricalData(historical);
        if (trends) setTrendsData(trends);
        if (history) setSessionHistory(history.sessions);
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
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes.toFixed(1)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(2)}`;
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('cost') || entry.name.includes('Cost') ? formatCost(entry.value) : entry.name.includes('usage') || entry.name.includes('Usage') ? formatTime(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100/50 backdrop-blur-sm p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'trends', label: 'Usage Trends', icon: '📈' },
          { id: 'history', label: 'Session History', icon: '📋' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Historical Usage Chart */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickFormatter={formatTime}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="usage" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.1}
                  name="Usage (minutes)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Session Count Chart */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sessions Per Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="sessions" 
                  fill="#8b5cf6" 
                  name="Sessions"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Subject Breakdown */}
          {trendsData && trendsData.subjectBreakdown.length > 0 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trendsData.subjectBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ subject, sessions }) => `${subject} (${sessions})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="usage"
                  >
                    {trendsData.subjectBreakdown.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={subjectsColors[entry.subject as keyof typeof subjectsColors] || '#6b7280'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatTime(value), 'Usage']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && trendsData && (
        <div className="space-y-6">
          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Total Sessions (30 days)</h4>
              <p className="text-2xl font-bold text-gray-900">{trendsData.totalSessions}</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Average Session</h4>
              <p className="text-2xl font-bold text-gray-900">{formatTime(trendsData.averageSessionLength)}</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Most Active Day</h4>
              <p className="text-2xl font-bold text-gray-900">
                {trendsData.peakUsageDays[0]?.date || 'No data'}
              </p>
              {trendsData.peakUsageDays[0] && (
                <p className="text-sm text-gray-600">{formatTime(trendsData.peakUsageDays[0].usage)}</p>
              )}
            </div>
          </div>

          {/* Daily Usage Chart */}
          {trendsData.dailyUsage.length > 0 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Usage Pattern (Last 30 Days)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={trendsData.dailyUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={12}
                    tickFormatter={formatTime}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="usage" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.2}
                    name="Daily Usage"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
          {sessionHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No sessions found</p>
              <p className="text-sm text-gray-500 mt-1">Start a conversation with your AI tutor to begin!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessionHistory.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-white/40 rounded-lg border border-white/20">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{session.tutors.name}</h4>
                    <p className="text-sm text-gray-600">{session.tutors.subject} • {session.tutors.topic}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(session.start_time).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatTime(session.duration_minutes)}</p>
                    <p className="text-sm text-gray-600">{formatCost(session.cost)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}