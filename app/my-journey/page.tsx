import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getUserCompanions,
  getUserSessions,
  getBookmarkedCompanions,
} from "@/lib/actions/companion.actions";
import Image from "next/image";
import CompanionsList from "@/components/CompanionsList";

const Profile = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const companions = await getUserCompanions(user.id);
  const sessionHistory = await getUserSessions(user.id);
  const bookmarkedCompanions = await getBookmarkedCompanions(user.id);

  return (
    <main className="max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <section className="bg-surface rounded-2xl border border-border-soft p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between gap-6 lg:items-center">
          <div className="flex gap-6 items-center">
            <div className="relative">
              <Image
                src={user.imageUrl}
                alt={user.firstName!}
                width={80}
                height={80}
                className="rounded-2xl ring-4 ring-primary/10"
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-accent-soft rounded-full border-4 border-surface flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-text-secondary">
                {user.emailAddresses[0].emailAddress}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-gradient-to-br from-primary/5 to-primary-soft/5 border border-primary/20 rounded-2xl p-4 space-y-2 min-w-[120px]">
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8 bg-accent-soft/10 rounded-lg flex items-center justify-center">
                  <Image
                    src="/icons/check.svg"
                    alt="checkmark"
                    width={16}
                    height={16}
                    className="opacity-70"
                  />
                </div>
                <p className="text-2xl font-bold text-text-primary">{sessionHistory.length}</p>
              </div>
              <p className="text-sm text-text-secondary font-medium">Lessons completed</p>
            </div>
            
            <div className="bg-gradient-to-br from-accent-warm/5 to-yellow-400/5 border border-accent-warm/20 rounded-2xl p-4 space-y-2 min-w-[120px]">
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8 bg-accent-warm/10 rounded-lg flex items-center justify-center">
                  <Image 
                    src="/icons/cap.svg" 
                    alt="cap" 
                    width={16} 
                    height={16}
                    className="opacity-70"
                  />
                </div>
                <p className="text-2xl font-bold text-text-primary">{companions.length}</p>
              </div>
              <p className="text-sm text-text-secondary font-medium">Companions created</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Journey Sections */}
      <div className="space-y-6">
        <Accordion type="multiple" className="space-y-4">
          <AccordionItem value="recent" className="bg-surface rounded-2xl border border-border-soft shadow-sm overflow-hidden">
            <AccordionTrigger className="px-8 py-6 text-xl font-semibold text-text-primary hover:bg-muted/50 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Recent Sessions
                <span className="text-sm text-text-tertiary bg-muted px-2 py-1 rounded-full ml-auto">
                  {sessionHistory.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-6">
              <CompanionsList
                title=""
                companions={sessionHistory}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="bookmarks" className="bg-surface rounded-2xl border border-border-soft shadow-sm overflow-hidden">
            <AccordionTrigger className="px-8 py-6 text-xl font-semibold text-text-primary hover:bg-muted/50 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-warm/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent-warm" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                </div>
                Bookmarked Companions
                <span className="text-sm text-text-tertiary bg-muted px-2 py-1 rounded-full ml-auto">
                  {bookmarkedCompanions.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-6">
              <CompanionsList
                companions={bookmarkedCompanions}
                title=""
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="companions" className="bg-surface rounded-2xl border border-border-soft shadow-sm overflow-hidden">
            <AccordionTrigger className="px-8 py-6 text-xl font-semibold text-text-primary hover:bg-muted/50 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-soft/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                My Companions
                <span className="text-sm text-text-tertiary bg-muted px-2 py-1 rounded-full ml-auto">
                  {companions.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-6">
              <CompanionsList title="" companions={companions} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
};
export default Profile;
