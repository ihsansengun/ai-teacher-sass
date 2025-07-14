import { UsageDashboard } from "@/components/UsageDashboard";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";

const UsagePage = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/dashboard" 
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Usage Analytics
              </h1>
            </div>
            <Link 
              href="/subscription" 
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage Plan
            </Link>
          </div>
          <p className="text-gray-600 mt-2">
            Monitor your voice usage and track your spending
          </p>
        </div>

        {/* Usage Dashboard */}
        <UsageDashboard />
        
        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/subscription" 
              className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 mr-2" />
              Upgrade Plan
            </Link>
            <Link 
              href="/companions" 
              className="flex items-center justify-center bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg transition-colors"
            >
              <span className="mr-2">🎯</span>
              Start Learning
            </Link>
            <Link 
              href="/dashboard/billing" 
              className="flex items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-lg transition-colors"
            >
              <span className="mr-2">💳</span>
              View Billing
            </Link>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Usage Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-4">
                <span className="text-blue-600 text-sm">💡</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Optimize Your Sessions
                </h4>
                <p className="text-sm text-gray-600">
                  Plan your questions ahead of time to make the most of your voice minutes. 
                  Use text chat when possible to save voice time.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-2 mr-4">
                <span className="text-green-600 text-sm">⏰</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Track Your Usage
                </h4>
                <p className="text-sm text-gray-600">
                  Keep an eye on your monthly usage to avoid overage charges. 
                  Consider upgrading if you consistently exceed your limit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsagePage;