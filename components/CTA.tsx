import Image from "next/image";
import Link from "next/link";

const Cta = () => {
    return (
        <section className="cta-section">
            <div className="cta-badge">
                <span className="font-semibold">✨ Start learning your way</span>
            </div>
            
            <div className="space-y-4 text-center">
                <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                    Create Your Perfect
                    <br />
                    <span className="bg-gradient-to-r from-accent-orange to-yellow-300 bg-clip-text text-transparent">
                        Learning Companion
                    </span>
                </h2>
                <p className="text-gray-300 leading-relaxed max-w-sm mx-auto">
                    Customize everything: name, subject, voice, and personality. Start learning through natural conversations.
                </p>
            </div>

            <div className="relative">
                <Image 
                    src="/images/cta.svg" 
                    alt="AI companion illustration" 
                    width={280} 
                    height={180}
                    className="transition-transform duration-300 hover:scale-105"
                />
            </div>

            <Link href="/companions/new" className="w-full">
                <button className="w-full bg-white text-gray-900 font-semibold px-6 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 hover:bg-gray-50 hover:shadow-xl hover:-translate-y-1">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <span>Create New Companion</span>
                    <svg 
                        className="w-4 h-4 transition-transform duration-200 hover:translate-x-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </Link>
        </section>
    )
}
export default Cta
