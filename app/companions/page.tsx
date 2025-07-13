import { getAllCompanions } from "@/lib/actions/companion.actions";
import CompanionCard from "@/components/CompanionCard";
import { getSubjectColor } from "@/lib/utils";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";

const CompanionsLibrary = async ({ searchParams }: SearchParams) => {
  const filters = await searchParams;
  const subject = filters.subject ? filters.subject : "";
  const topic = filters.topic ? filters.topic : "";

  const tutors = await getAllCompanions({ subject, topic });
  console.log(tutors);

  return (
    <main>
      <section className="flex justify-between gap-4 max-sm:flex-col">
        <h1>Tutor Library</h1>
        <div className="flex gap-4">
          <SearchInput />
          <SubjectFilter />
        </div>
      </section>
      <section className="companions-grid">
        {tutors?.map((tutor) => (
          <CompanionCard
            key={tutor.id}
            {...tutor}
            color={getSubjectColor(tutor.subject)}
          />
        ))}
      </section>
    </main>
  );
};

export default CompanionsLibrary;
