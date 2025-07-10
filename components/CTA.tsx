import Image from "next/image";
import Link from "next/link";

const Cta = () => {
  return (
    <section className="cta-section">
      <div className="cta-badge">Personalized Education Platform</div>
      <h2 className="text-3xl font-bold">
        Create Your Custom AI Learning Tutor
      </h2>
      <p>
        Choose a name, subject, voice, & teaching style — and enhance your knowledge through
        interactive conversations that are engaging and effective.
      </p>
      <Image src="/images/cta.svg" alt="cta" width={362} height={232} />
      <button className="btn-primary">
        <Image src="/icons/plus.svg" alt="plus" width={12} height={12} />
        <Link href="/companions/new">
          <p>Create New AI Tutor</p>
        </Link>
      </button>
    </section>
  );
};

export default Cta;
