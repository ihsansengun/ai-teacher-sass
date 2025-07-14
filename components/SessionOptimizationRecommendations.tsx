'use client';

import { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Clock, 
  BookOpen, 
  Star, 
  AlertCircle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { getUsageTrends, getUserUsageAnalytics } from '@/lib/actions/subscription.actions';
import { subjectsColors } from '@/constants';

interface OptimizationInsight {
  type: 'warning' | 'tip' | 'success' | 'info';
  title: string;
  description: string;
  action?: string;
  impact: 'high' | 'medium' | 'low';
  icon: React.ComponentType<{ className?: string }>;
}

interface SessionPattern {
  peakHours: number[];
  mostProductiveSubjects: string[];
  optimalSessionLength: number;
  usageEfficiency: number;
  costEfficiency: number;
}

export default function SessionOptimizationRecommendations() {
  const [insights, setInsights] = useState<OptimizationInsight[]>([]);
  const [patterns, setPatterns] = useState<SessionPattern | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyzeSessionData = async () => {
      try {
        setLoading(true);
        
        const [analytics, trends] = await Promise.all([
          getUserUsageAnalytics(),
          getUsageTrends()
        ]);

        if (!analytics || !trends) return;

        // Analyze patterns
        const sessionPattern = analyzePatterns(analytics, trends);
        setPatterns(sessionPattern);

        // Generate insights
        const generatedInsights = generateInsights(analytics, trends, sessionPattern);
        setInsights(generatedInsights);

      } catch (error) {
        console.error('Error analyzing session data:', error);
      } finally {
        setLoading(false);
      }
    };

    analyzeSessionData();
  }, []);

  const analyzePatterns = (analytics: any, trends: any): SessionPattern => {
    // Analyze peak hours (mock implementation - should use real session timestamps)
    const peakHours = [9, 10, 14, 15, 20]; // Most common session start hours
    
    // Find most productive subjects based on session count and duration
    const mostProductiveSubjects = trends.subjectBreakdown
      .sort((a: any, b: any) => b.sessions - a.sessions)
      .slice(0, 3)
      .map((subject: any) => subject.subject);
    
    // Calculate optimal session length
    const optimalSessionLength = trends.averageSessionLength || 15;
    
    // Calculate efficiency metrics
    const usageEfficiency = calculateUsageEfficiency(analytics);
    const costEfficiency = calculateCostEfficiency(analytics);

    return {
      peakHours,
      mostProductiveSubjects,
      optimalSessionLength,
      usageEfficiency,
      costEfficiency
    };
  };

  const calculateUsageEfficiency = (analytics: any): number => {
    // Calculate efficiency based on usage vs limits
    const { usage } = analytics;
    if (usage.voiceMinutesLimit === 0) return 100;
    
    const utilizationRate = (usage.voiceMinutesUsed / usage.voiceMinutesLimit) * 100;
    
    // Optimal usage is around 70-85%
    if (utilizationRate >= 70 && utilizationRate <= 85) return 100;
    if (utilizationRate < 70) return utilizationRate + 20; // Underutilizing
    return Math.max(0, 100 - (utilizationRate - 85)); // Overutilizing
  };

  const calculateCostEfficiency = (analytics: any): number => {
    // Calculate cost efficiency based on cost per minute
    const { billing, usage } = analytics;
    if (usage.voiceMinutesUsed === 0) return 100;
    
    const costPerMinute = billing.totalCost / usage.voiceMinutesUsed;
    
    // Assuming optimal cost per minute is around $0.10
    const optimalCostPerMinute = 0.10;
    const efficiency = Math.max(0, 100 - ((costPerMinute - optimalCostPerMinute) / optimalCostPerMinute) * 100);
    
    return Math.min(100, efficiency);
  };

  const generateInsights = (analytics: any, trends: any, patterns: SessionPattern): OptimizationInsight[] => {
    const insights: OptimizationInsight[] = [];
    const { usage, billing, sessions } = analytics;

    // Usage efficiency insights
    if (patterns.usageEfficiency < 60) {
      insights.push({
        type: 'warning',
        title: 'Low Usage Efficiency',
        description: `You're only using ${usage.usagePercentage.toFixed(1)}% of your monthly allocation. Consider upgrading your learning routine or downgrading your plan.`,
        action: 'Schedule more regular sessions',
        impact: 'medium',
        icon: AlertCircle
      });
    } else if (patterns.usageEfficiency >= 90) {
      insights.push({
        type: 'success',
        title: 'Excellent Usage Efficiency',
        description: 'You\'re making optimal use of your voice minutes allocation.',
        impact: 'low',
        icon: CheckCircle
      });
    }

    // Session length optimization
    if (trends.averageSessionLength < 5) {
      insights.push({
        type: 'tip',
        title: 'Consider Longer Sessions',
        description: `Your average session is ${trends.averageSessionLength.toFixed(1)} minutes. Longer sessions (10-15 minutes) often provide better learning outcomes.`,
        action: 'Plan more comprehensive topics',
        impact: 'high',
        icon: Clock
      });
    } else if (trends.averageSessionLength > 25) {
      insights.push({
        type: 'tip',
        title: 'Break Down Long Sessions',
        description: `Your sessions average ${trends.averageSessionLength.toFixed(1)} minutes. Consider shorter, focused sessions for better retention.`,
        action: 'Split complex topics into smaller sessions',
        impact: 'medium',
        icon: Target
      });
    }

    // Subject diversity
    if (trends.subjectBreakdown.length === 1) {
      insights.push({
        type: 'tip',
        title: 'Diversify Your Learning',
        description: 'You\'re focusing on only one subject. Exploring multiple subjects can enhance your overall learning experience.',
        action: 'Try sessions in different subjects',
        impact: 'medium',
        icon: BookOpen
      });
    } else if (trends.subjectBreakdown.length >= 4) {
      insights.push({
        type: 'success',
        title: 'Great Subject Diversity',
        description: `You're actively learning across ${trends.subjectBreakdown.length} different subjects. Keep up the diverse learning approach!`,
        impact: 'low',
        icon: Star
      });
    }

    // Cost optimization
    if (billing.overageCost > 0) {
      insights.push({
        type: 'warning',
        title: 'Overage Charges Detected',
        description: `You have $${billing.overageCost.toFixed(2)} in overage charges this month. Consider upgrading your plan or managing your usage.`,
        action: 'Review your plan options',
        impact: 'high',
        icon: AlertCircle
      });
    }

    // Session frequency
    const dailyAverage = trends.totalSessions / 30; // Approximate monthly to daily
    if (dailyAverage < 0.5) {
      insights.push({
        type: 'tip',
        title: 'Increase Session Frequency',
        description: 'You average less than one session every two days. More frequent, shorter sessions often lead to better learning outcomes.',
        action: 'Aim for daily 10-minute sessions',
        impact: 'high',
        icon: TrendingUp
      });
    }

    // Peak time optimization
    insights.push({
      type: 'info',
      title: 'Optimal Learning Times',
      description: `Based on your patterns, you seem most active during ${patterns.peakHours.slice(0, 2).join(' and ')} o'clock. Schedule important topics during these peak hours.`,
      action: 'Plan challenging topics for peak hours',
      impact: 'medium',
      icon: Lightbulb
    });

    return insights;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertCircle;
      case 'success': return CheckCircle;
      case 'tip': return Lightbulb;
      default: return BarChart3;
    }
  };

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      {patterns && (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Performance Overview
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50/60 rounded-lg border border-blue-200/30">
              <div className="text-2xl font-bold text-blue-700 mb-1">
                {patterns.usageEfficiency.toFixed(0)}%
              </div>
              <div className="text-sm text-blue-600">Usage Efficiency</div>
            </div>
            
            <div className="text-center p-4 bg-green-50/60 rounded-lg border border-green-200/30">
              <div className="text-2xl font-bold text-green-700 mb-1">
                {patterns.costEfficiency.toFixed(0)}%
              </div>
              <div className="text-sm text-green-600">Cost Efficiency</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50/60 rounded-lg border border-purple-200/30">
              <div className="text-2xl font-bold text-purple-700 mb-1">
                {patterns.optimalSessionLength.toFixed(1)}m
              </div>
              <div className="text-sm text-purple-600">Avg Session</div>
            </div>
          </div>
        </div>
      )}

      {/* Optimization Insights */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2" />
          Optimization Insights
        </h3>
        
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">All Looking Good!</h4>
            <p className="text-gray-600">
              Your learning patterns are well-optimized. Keep up the great work!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getImpactColor(insight.impact)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{insight.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                          insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {insight.impact} impact
                        </span>
                      </div>
                      <p className="text-sm opacity-90 mb-2">
                        {insight.description}
                      </p>
                      {insight.action && (
                        <p className="text-sm font-medium">
                          💡 {insight.action}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Learning Patterns */}
      {patterns && patterns.mostProductiveSubjects.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Your Learning Patterns
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Most Active Subjects */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Most Active Subjects</h4>
              <div className="space-y-2">
                {patterns.mostProductiveSubjects.map((subject, index) => (
                  <div key={subject} className="flex items-center justify-between p-2 bg-gray-50/60 rounded">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: subjectsColors[subject as keyof typeof subjectsColors] || '#6b7280' }}
                      />
                      <span className="text-sm capitalize">{subject}</span>
                    </div>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Peak Learning Hours */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Peak Learning Hours</h4>
              <div className="space-y-2">
                {patterns.peakHours.slice(0, 3).map((hour, index) => (
                  <div key={hour} className="flex items-center justify-between p-2 bg-gray-50/60 rounded">
                    <span className="text-sm">
                      {hour}:00 - {hour + 1}:00
                    </span>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-purple-500'
                      }`} />
                      <span className="text-xs text-gray-500">Peak #{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}