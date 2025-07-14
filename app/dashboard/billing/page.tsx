import { getUserUsageAnalytics } from "@/lib/actions/subscription.actions";
import Link from "next/link";
import { ArrowLeft, Download, CreditCard, Calendar, Receipt } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const BillingPage = async () => {
  const analytics = await getUserUsageAnalytics();
  
  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Unable to load billing information</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { subscription, sessions, billing, plan } = analytics;

  // Calculate monthly sessions for history
  const monthlyHistory = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    // This is mock data - in real implementation, you'd query historical data
    const mockUsage = Math.random() * plan.features.voiceMinutes * 0.8;
    const mockCost = billing.baseCost + (mockUsage > plan.features.voiceMinutes ? 
      (mockUsage - plan.features.voiceMinutes) * 0.20 : 0);
    
    return {
      month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      usage: mockUsage,
      cost: mockCost,
      date: monthStart
    };
  }).reverse();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/dashboard/usage" 
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Usage
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Billing & Invoices
              </h1>
            </div>
            <Link 
              href="/subscription" 
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Subscription
            </Link>
          </div>
          <p className="text-gray-600 mt-2">
            View your billing history and download invoices
          </p>
        </div>

        {/* Current Bill Summary */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Bill</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">${billing.totalCost.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total This Month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">${billing.baseCost.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Base Plan Cost</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">${billing.overageCost.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Overage Charges</div>
            </div>
          </div>
          
          {/* Billing Cycle */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Current Billing Cycle</h3>
                <p className="text-sm text-gray-600">
                  {subscription.currentPeriodStart.toLocaleDateString()} - {subscription.currentPeriodEnd.toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Next bill in</p>
                <p className="font-medium text-gray-900">
                  {formatDistanceToNow(subscription.currentPeriodEnd)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Breakdown */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage Breakdown</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <h3 className="font-medium text-gray-900">{plan.name} Plan</h3>
                <p className="text-sm text-gray-600">{plan.features.voiceMinutes} voice minutes included</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">${billing.baseCost.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Monthly</p>
              </div>
            </div>
            
            {billing.overageCost > 0 && (
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-medium text-orange-800">Overage Usage</h3>
                  <p className="text-sm text-orange-600">
                    {(subscription.voiceMinutesUsed - subscription.voiceMinutesLimit).toFixed(1)} extra minutes
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-orange-800">${billing.overageCost.toFixed(2)}</p>
                  <p className="text-sm text-orange-600">$0.20/min</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Billing History */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Billing History</h2>
            <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
              <Download className="w-4 h-4 mr-1" />
              Download All
            </button>
          </div>
          
          <div className="space-y-3">
            {monthlyHistory.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">{month.month}</h3>
                    <p className="text-sm text-gray-600">
                      {month.usage.toFixed(1)} minutes used
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <p className="font-medium text-gray-900">${month.cost.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      {index === 0 ? 'Current' : 'Paid'}
                    </p>
                  </div>
                  <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
                    <Receipt className="w-4 h-4 mr-1" />
                    {index === 0 ? 'Preview' : 'Download'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-gray-400 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">•••• •••• •••• 4242</h3>
                <p className="text-sm text-gray-600">Expires 12/2025</p>
              </div>
            </div>
            <Link 
              href="/subscription"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Update
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;