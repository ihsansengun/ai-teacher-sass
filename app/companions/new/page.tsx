import CompanionForm from "@/components/CompanionForm";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {newCompanionPermissions} from "@/lib/actions/companion.actions";
import Image from "next/image";
import Link from "next/link";

const NewCompanion = async () => {
    const { userId } = await auth();
    if(!userId) redirect('/sign-in');

    const canCreateCompanion = await newCompanionPermissions();

    return (
        <main className="max-w-2xl mx-auto">
            {canCreateCompanion ? (
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary-soft bg-clip-text text-transparent">
                            Companion Builder
                        </h1>
                        <p className="text-text-secondary max-w-lg mx-auto">
                            Create a personalized AI tutor that matches your learning style and goals. 
                            Every detail can be customized to create the perfect learning experience.
                        </p>
                    </div>

                    <CompanionForm />
                </div>
            ) : (
                <article className="companion-limit">
                    <div className="relative mb-6">
                        <Image 
                            src="/images/limit.svg" 
                            alt="Companion limit reached" 
                            width={300} 
                            height={200}
                            className="opacity-90"
                        />
                    </div>
                    <div className="cta-badge mb-4">
                        <span className="font-semibold">🚀 Upgrade your plan</span>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold mb-4">You've Reached Your Limit</h1>
                    <p className="text-text-secondary leading-relaxed mb-6">
                        You've reached your companion limit. Upgrade to create unlimited companions and unlock premium features.
                    </p>
                    <Link href="/subscription" className="btn-primary w-full justify-center">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>Upgrade My Plan</span>
                        <svg 
                            className="w-4 h-4 transition-transform duration-200 hover:translate-x-1" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </article>
            )}
        </main>
    )
}

export default NewCompanion
