'use client';

import { useState } from 'react';
import { Bell, DollarSign, Clock, TrendingUp, Settings, Save } from 'lucide-react';

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
  billing: {
    totalCost: number;
    baseCost: number;
    overageCost: number;
  };
  plan: {
    name: string;
    features: {
      maxSessionDuration: number;
    };
  };
  usage: {
    voiceMinutesUsed: number;
    voiceMinutesLimit: number;
    usagePercentage: number;
    remainingMinutes: number;
    isOverLimit: boolean;
  };
}

interface UsageAlertsProps {
  analytics: AnalyticsData;
}

interface AlertSettings {
  usageWarningAt: number; // percentage
  costWarningAt: number; // dollar amount
  dailyUsageLimit: number; // minutes per day
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export default function UsageAlerts({ analytics }: UsageAlertsProps) {
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    usageWarningAt: 80,
    costWarningAt: 50,
    dailyUsageLimit: 30,
    emailNotifications: true,
    pushNotifications: false,
  });
  
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to the database
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getUsageProjection = () => {
    const { usage, subscription } = analytics;
    const daysInMonth = new Date(subscription.currentPeriodEnd.getFullYear(), subscription.currentPeriodEnd.getMonth() + 1, 0).getDate();
    const daysElapsed = Math.ceil((new Date().getTime() - subscription.currentPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = daysInMonth - daysElapsed;
    
    if (daysElapsed === 0) return usage.voiceMinutesUsed;
    
    const dailyAverage = usage.voiceMinutesUsed / daysElapsed;
    return usage.voiceMinutesUsed + (dailyAverage * daysRemaining);
  };

  const getCostProjection = () => {
    const { billing, subscription } = analytics;
    const daysInMonth = new Date(subscription.currentPeriodEnd.getFullYear(), subscription.currentPeriodEnd.getMonth() + 1, 0).getDate();
    const daysElapsed = Math.ceil((new Date().getTime() - subscription.currentPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = daysInMonth - daysElapsed;
    
    if (daysElapsed === 0) return billing.totalCost;
    
    const dailyAverage = billing.totalCost / daysElapsed;
    return billing.totalCost + (dailyAverage * daysRemaining);
  };

  const usageProjection = getUsageProjection();
  const costProjection = getCostProjection();
  const projectedUsagePercentage = (usageProjection / analytics.usage.voiceMinutesLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Usage Projections
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Current Usage</span>
                <span className="text-sm font-medium">{analytics.usage.usagePercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${Math.min(100, analytics.usage.usagePercentage)}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Projected End-of-Month</span>
                <span className={`text-sm font-medium ${projectedUsagePercentage > 100 ? 'text-red-600' : projectedUsagePercentage > alertSettings.usageWarningAt ? 'text-yellow-600' : 'text-green-600'}`}>
                  {projectedUsagePercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${projectedUsagePercentage > 100 ? 'bg-red-500' : projectedUsagePercentage > alertSettings.usageWarningAt ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(100, projectedUsagePercentage)}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Bill</span>
              <span className="text-lg font-semibold">${analytics.billing.totalCost.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Projected Bill</span>
              <span className={`text-lg font-semibold ${costProjection > alertSettings.costWarningAt ? 'text-red-600' : 'text-green-600'}`}>
                ${costProjection.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Active Alerts
        </h3>
        
        <div className="space-y-3">
          {analytics.usage.usagePercentage >= alertSettings.usageWarningAt && (
            <div className={`p-4 rounded-lg border ${analytics.usage.isOverLimit ? 'bg-red-50/60 border-red-200' : 'bg-yellow-50/60 border-yellow-200'}`}>
              <div className="flex items-center">
                <Clock className={`w-5 h-5 mr-2 ${analytics.usage.isOverLimit ? 'text-red-600' : 'text-yellow-600'}`} />
                <div>
                  <h4 className={`font-medium ${analytics.usage.isOverLimit ? 'text-red-800' : 'text-yellow-800'}`}>
                    Usage Alert
                  </h4>
                  <p className={`text-sm ${analytics.usage.isOverLimit ? 'text-red-700' : 'text-yellow-700'}`}>
                    You&apos;ve used {analytics.usage.usagePercentage.toFixed(1)}% of your monthly voice minutes
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {analytics.billing.totalCost >= alertSettings.costWarningAt && (
            <div className="p-4 rounded-lg border bg-orange-50/60 border-orange-200">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
                <div>
                  <h4 className="font-medium text-orange-800">Cost Alert</h4>
                  <p className="text-sm text-orange-700">
                    Your current bill (${analytics.billing.totalCost.toFixed(2)}) has reached your alert threshold
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {projectedUsagePercentage > 100 && (
            <div className="p-4 rounded-lg border bg-red-50/60 border-red-200">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-red-600" />
                <div>
                  <h4 className="font-medium text-red-800">Overage Warning</h4>
                  <p className="text-sm text-red-700">
                    At your current usage rate, you&apos;ll exceed your limit by {(projectedUsagePercentage - 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {analytics.usage.usagePercentage < alertSettings.usageWarningAt && analytics.billing.totalCost < alertSettings.costWarningAt && projectedUsagePercentage <= 100 && (
            <div className="p-4 rounded-lg border bg-green-50/60 border-green-200">
              <div className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">All Good!</h4>
                  <p className="text-sm text-green-700">
                    Your usage is within normal limits
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alert Settings */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Alert Settings
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usage Warning Threshold
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={alertSettings.usageWarningAt}
                onChange={(e) => setAlertSettings(prev => ({ ...prev, usageWarningAt: parseInt(e.target.value) }))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-12">{alertSettings.usageWarningAt}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Get notified when you reach this percentage of your monthly limit</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost Warning Threshold
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="10"
                max="500"
                step="10"
                value={alertSettings.costWarningAt}
                onChange={(e) => setAlertSettings(prev => ({ ...prev, costWarningAt: parseInt(e.target.value) }))}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-600">USD</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Get notified when your monthly bill reaches this amount</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Usage Limit
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="5"
                max="120"
                step="5"
                value={alertSettings.dailyUsageLimit}
                onChange={(e) => setAlertSettings(prev => ({ ...prev, dailyUsageLimit: parseInt(e.target.value) }))}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-600">minutes</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Get notified if you exceed this daily usage limit</p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Notification Preferences</h4>
            
            <div className="flex items-center">
              <input
                id="email-notifications"
                type="checkbox"
                checked={alertSettings.emailNotifications}
                onChange={(e) => setAlertSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="email-notifications" className="ml-2 text-sm text-gray-700">
                Email notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="push-notifications"
                type="checkbox"
                checked={alertSettings.pushNotifications}
                onChange={(e) => setAlertSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="push-notifications" className="ml-2 text-sm text-gray-700">
                Push notifications
              </label>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                saved 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Save size={16} />
              {saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}