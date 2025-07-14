import { getUserUsageAnalytics } from "@/lib/actions/subscription.actions";
import { getRecentCompanions, getUserCompanions } from "@/lib/actions/companion.actions";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Clock, Target, Award, BookOpen, BarChart3 } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

const MyProgressPage = async () => {
  const { userId } = await auth();
  const analytics = await getUserUsageAnalytics();
  const recentSessions = userId ? await getRecentCompanions(userId, 10) : [];
  const userTutors = userId ? await getUserCompanions(userId) : [];
  
  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">Unable to load progress data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { subscription, sessions, usage } = analytics;

  // Calculate progress metrics
  const totalLearningTime = usage.voiceMinutesUsed;
  const averageSessionLength = sessions.length > 0 ? totalLearningTime / sessions.length : 0;
  const sessionsThisWeek = sessions.filter(session => {
    const sessionDate = new Date(session.start_time);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  }).length;

  // Calculate learning streak (mock data for now)
  const learningStreak = Math.min(Math.floor(sessions.length / 2) + 1, 15);
  
  // Subject breakdown based on user's tutors
  const subjectBreakdown = userTutors.reduce((acc: any, tutor: any) => {
    const subject = tutor.subject || 'Other';
    acc[subject] = (acc[subject] || 0) + 1;
    return acc;
  }, {});

  // Weekly progress (mock data)
  const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const sessionsOnDay = sessions.filter(session => {
      const sessionDate = new Date(session.start_time);
      return sessionDate.toDateString() === date.toDateString();
    }).length;
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      sessions: sessionsOnDay,
      minutes: sessionsOnDay * averageSessionLength
    };
  });

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
                My Learning Progress
              </h1>
            </div>
            <Link 
              href="/companions" 
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Start Learning
            </Link>
          </div>
          <p className="text-gray-600 mt-2">
            Track your learning journey and achievements
          </p>
        </div>

        {/* Progress Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Learning Time */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                {totalLearningTime.toFixed(1)}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">Total Minutes</h3>
            <p className="text-sm text-gray-600">Learning time this month</p>
          </div>

          {/* Learning Streak */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold text-gray-900">
                {learningStreak}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">Day Streak</h3>
            <p className="text-sm text-gray-600">Consecutive learning days</p>
          </div>

          {/* Sessions This Week */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">
                {sessionsThisWeek}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">Sessions</h3>
            <p className="text-sm text-gray-600">This week</p>
          </div>

          {/* Average Session */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">
                {averageSessionLength.toFixed(1)}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">Avg. Session</h3>
            <p className="text-sm text-gray-600">Minutes per session</p>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">This Week's Activity</h2>
          <div className="grid grid-cols-7 gap-4">
            {weeklyProgress.map((day, index) => (
              <div key={day.day} className="text-center">
                <div className="text-sm text-gray-600 mb-2">{day.day}</div>
                <div 
                  className="bg-blue-100 rounded-lg flex items-end justify-center text-xs font-medium text-blue-800 transition-all hover:bg-blue-200"
                  style={{ 
                    height: `${Math.max(20, (day.sessions / Math.max(...weeklyProgress.map(d => d.sessions), 1)) * 60)}px` 
                  }}
                >
                  {day.sessions > 0 && day.sessions}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {day.minutes.toFixed(0)}m
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Subjects</h2>
          {Object.keys(subjectBreakdown).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(subjectBreakdown).map(([subject, count]: [string, any]) => (
                <div key={subject} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-600 mr-3"></div>
                    <span className="font-medium text-gray-900">{subject}</span>
                  </div>
                  <span className="text-sm text-gray-600">{count} tutors</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No tutors created yet</p>
              <p className="text-sm">Create your first AI tutor to start tracking progress!</p>
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Learning Sessions</h2>
          {recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.slice(0, 5).map((session: any) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <div>
                      <h3 className="font-medium text-gray-900">{session.name}</h3>
                      <p className="text-sm text-gray-600">{session.subject} • {session.topic}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900 font-medium">Recently accessed</p>
                    <p className="text-xs text-gray-500">Voice session available</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent sessions</p>
              <p className="text-sm">Start a conversation with your AI tutors to see activity here!</p>
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* First Session Achievement */}
            <div className={`p-4 rounded-lg border-2 ${sessions.length > 0 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center mb-2">
                <Award className={`w-6 h-6 mr-2 ${sessions.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                <h3 className={`font-medium ${sessions.length > 0 ? 'text-green-800' : 'text-gray-600'}`}>
                  First Steps
                </h3>
              </div>
              <p className={`text-sm ${sessions.length > 0 ? 'text-green-700' : 'text-gray-500'}`}>
                Complete your first learning session
              </p>
            </div>

            {/* Weekly Learner Achievement */}
            <div className={`p-4 rounded-lg border-2 ${sessionsThisWeek >= 3 ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center mb-2">
                <Target className={`w-6 h-6 mr-2 ${sessionsThisWeek >= 3 ? 'text-blue-600' : 'text-gray-400'}`} />
                <h3 className={`font-medium ${sessionsThisWeek >= 3 ? 'text-blue-800' : 'text-gray-600'}`}>
                  Weekly Learner
                </h3>
              </div>
              <p className={`text-sm ${sessionsThisWeek >= 3 ? 'text-blue-700' : 'text-gray-500'}`}>
                Complete 3 sessions in a week
              </p>
            </div>

            {/* Streak Master Achievement */}
            <div className={`p-4 rounded-lg border-2 ${learningStreak >= 7 ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center mb-2">
                <TrendingUp className={`w-6 h-6 mr-2 ${learningStreak >= 7 ? 'text-purple-600' : 'text-gray-400'}`} />
                <h3 className={`font-medium ${learningStreak >= 7 ? 'text-purple-800' : 'text-gray-600'}`}>
                  Streak Master
                </h3>
              </div>
              <p className={`text-sm ${learningStreak >= 7 ? 'text-purple-700' : 'text-gray-500'}`}>
                Maintain a 7-day learning streak
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProgressPage;