import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import CTA from "@/components/CTA";
import {recentSessions} from "@/constants";
import {getAllCompanions, getRecentSessions} from "@/lib/actions/companion.actions";
import {getSubjectColor} from "@/lib/utils";

const Page = async () => {
    const companions = await getAllCompanions({ limit: 3 });
    const recentSessionsCompanions = await getRecentSessions(10);

  return (
    <main>
      {/* Hero Section */}
      <section className="text-center space-y-6 sm:space-y-8 py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent-soft/4 to-accent-warm/6 rounded-2xl sm:rounded-[2.5rem] border-2 border-primary/5"></div>
        <div className="relative z-10 space-y-6 sm:space-y-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/15 to-primary-soft/15 rounded-full flex items-center justify-center shadow-lg animate-float">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary-soft rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-primary-soft to-accent-soft bg-clip-text text-transparent px-4">
            Your AI Teacher
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed font-medium px-4">
            Meet your friendly AI companions that make learning fun! Chat, explore, and master any subject with personalized tutors designed just for you.
          </p>
          <div className="flex justify-center gap-4 sm:gap-6 mt-8 sm:mt-12">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-primary to-primary-soft rounded-full animate-float shadow-lg"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-accent-soft to-accent-warm rounded-full animate-float shadow-lg" style={{animationDelay: '0.5s'}}></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-accent-warm to-accent-gentle rounded-full animate-float shadow-lg" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </section>

      {/* Popular Companions Section */}
      <section className="space-y-8 sm:space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary">Featured AI Tutors</h2>
            <p className="text-text-secondary text-sm sm:text-base">Start learning with our most popular companions</p>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-primary bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-primary/20 self-start sm:self-auto">
            Featured
          </span>
        </div>

        <div className="companions-grid">
          {companions.map((companion) => (
            <CompanionCard
              key={companion.id}
              {...companion}
              color={getSubjectColor(companion.subject)}
            />
          ))}
        </div>
      </section>

      {/* Recent Sessions and CTA Section */}
      <section className="home-section">
        <div className="w-full lg:w-2/3">
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
