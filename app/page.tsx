import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import CTA from "@/components/CTA";
import {getAllCompanions, getRecentSessions} from "@/lib/actions/companion.actions";
import {getSubjectColor} from "@/lib/utils";

const Page = async () => {
    const companions = await getAllCompanions({ limit: 3 });
    const recentSessionsCompanions = await getRecentSessions(10);

  return (
    <main className="relative min-h-screen">
      {/* Neural Background Patterns */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-neural-purple/20 to-transparent rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-neural-blue/15 to-transparent rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-neural-green/10 to-transparent rounded-full blur-md animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-br from-neural-orange/8 to-transparent rounded-full blur-sm animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Hero Section */}
      <section className="text-center space-y-8 sm:space-y-12 py-16 sm:py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 glass-panel rounded-3xl neural-pattern opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-neural-purple/5 via-neural-blue/3 to-neural-green/4 rounded-3xl"></div>
        
        <div className="relative z-10 space-y-8 sm:space-y-12">
          {/* Neural Brain Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-neural-purple/40 via-neural-blue/40 to-neural-green/40 rounded-full blur-2xl animate-ping"></div>
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 glass-panel rounded-full flex items-center justify-center animate-bounce">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-neural-purple via-neural-blue to-neural-green rounded-full flex items-center justify-center relative">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                  {/* Neural connections */}
                  <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
                  <div className="absolute -top-2 -right-2 w-2 h-2 bg-neural-orange rounded-full animate-ping"></div>
                  <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-neural-green rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold gradient-neural px-4 text-shadow-neural">
              Your AI Teacher
            </h1>
            <div className="flex justify-center">
              <div className="h-1 w-32 bg-gradient-to-r from-neural-purple via-neural-blue to-neural-green rounded-full"></div>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed font-medium px-4 text-neural-600">
            Meet your friendly AI companions that make learning fun! Chat, explore, and master any subject with personalized tutors designed just for you.
          </p>

          {/* Neural Dots Animation */}
          <div className="flex justify-center gap-6 sm:gap-8 mt-12">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-neural-purple rounded-full animate-pulse shadow-lg"></div>
              <div className="w-8 h-0.5 bg-gradient-to-r from-neural-purple to-neural-blue"></div>
            </div>
            <div className="flex items-center gap-2" style={{animationDelay: '0.3s'}}>
              <div className="w-4 h-4 bg-neural-blue rounded-full animate-pulse shadow-lg"></div>
              <div className="w-8 h-0.5 bg-gradient-to-r from-neural-blue to-neural-green"></div>
            </div>
            <div className="flex items-center gap-2" style={{animationDelay: '0.6s'}}>
              <div className="w-4 h-4 bg-neural-green rounded-full animate-pulse shadow-lg"></div>
              <div className="w-8 h-0.5 bg-gradient-to-r from-neural-green to-neural-orange"></div>
            </div>
            <div className="w-4 h-4 bg-neural-orange rounded-full animate-pulse shadow-lg" style={{animationDelay: '0.9s'}}></div>
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <section className="space-y-8 sm:space-y-12 relative z-10">
        <div className="glass-panel rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-neural">Featured AI Tutors</h2>
              <p className="text-neural-600 text-base sm:text-lg">Start learning with our most popular companions</p>
            </div>
            <div className="glass-panel rounded-full px-4 py-2 border border-neural-purple/30">
              <span className="text-sm font-semibold gradient-neural flex items-center gap-2">
                <div className="w-2 h-2 bg-neural-green rounded-full animate-pulse"></div>
                Featured
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {companions.map((companion) => (
              <CompanionCard
                key={companion.id}
                {...companion}
                color={getSubjectColor(companion.subject)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Sessions and CTA Section */}
      <section className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10 items-start">
        <div className="flex-1 w-full">
          <CompanionsList
            title="Recently completed sessions"
            companions={recentSessionsCompanions}
          />
        </div>
        <CTA />
      </section>
    </main>
  )
}

export default Page
