import React from "react";
import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import CTA from "@/components/CTA";
import { recentSessions } from "@/constants";

const Page = () => {
  return (
    <main>
      <h1 className="text-2xl underline"> Featured AI Tutors </h1>
      <section className="home-section">
        <CompanionCard
          id="123"
          name="Professor Neuron"
          topic="Brain Structure & Function"
          subject="science"
          duration={45}
          color={"#6b99eb"}
        ></CompanionCard>

        <CompanionCard
          id="124"
          name="Math Mentor"
          topic="Calculus Fundamentals"
          subject="Maths"
          duration={30}
          color={"#7fe488"}
        ></CompanionCard>

        <CompanionCard
          id="125"
          name="Literary Guide"
          topic="Classic Literature Analysis"
          subject="Language"
          duration={30}
          color={"#d08b69"}
        ></CompanionCard>
      </section>

      <section className="home-section">
        <CompanionsList
          title="Your Learning History"
          companions={recentSessions}
          classNames="w-2/3 max-lg:w-full"
        />
        <CTA />
      </section>
    </main>
  );
};

export default Page;
