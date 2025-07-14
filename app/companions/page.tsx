import {getAllCompanions} from "@/lib/actions/companion.actions";
import CompanionCard from "@/components/CompanionCard";
import {getSubjectColor} from "@/lib/utils";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";
import type {SearchParams} from "@/types/index.d";

const CompanionsLibrary = async ({ searchParams }: SearchParams) => {
    const filters = await searchParams;
    const subject = Array.isArray(filters.subject) ? filters.subject[0] : filters.subject || '';
    const topic = Array.isArray(filters.topic) ? filters.topic[0] : filters.topic || '';

    const companions = await getAllCompanions({ subject, topic });

    return (
        <main>
            <section className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-neural">Companion Library</h1>
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-initial sm:min-w-[240px] md:min-w-[280px]">
                        <SearchInput />
                    </div>
                    <div className="flex-shrink-0 sm:min-w-[140px] md:min-w-[160px]">
                        <SubjectFilter />
                    </div>
                </div>
            </section>
            <section className="companions-grid">
                {companions.map((companion) => (
                    <CompanionCard
                        key={companion.id}
                        {...companion}
                        color={getSubjectColor(companion.subject)}
                    />
                ))}
            </section>
        </main>
    )
}

export default CompanionsLibrary
