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
      <section className="text-center space-y-6 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent-mint/5 rounded-3xl"></div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary-soft to-accent-mint bg-clip-text text-transparent animate-pulse-glow">
            Learn with AI Companions
          </h1>
          <p className="text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Personalized AI tutors that adapt to your learning style. Start conversations that make complex topics simple and engaging.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <div className="w-3 h-3 bg-primary rounded-full animate-float"></div>
            <div className="w-3 h-3 bg-accent-mint rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
            <div className="w-3 h-3 bg-accent-orange rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </section>

      {/* Popular Companions Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl lg:text-3xl font-semibold">Popular Companions</h2>
          <span className="text-sm text-text-tertiary bg-muted px-3 py-1 rounded-full">
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