import Image from "next/image";
import Link from "next/link";

const Cta = () => {
    return (
        <section className="relative w-full lg:w-1/3 rounded-[2rem] p-8 bg-gradient-to-br from-primary via-primary-soft to-accent-soft text-white shadow-2xl overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5"></div>
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-accent-warm/20 rounded-full blur-xl"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center gap-6">
                <div className="bg-gradient-to-r from-accent-warm/20 to-accent-gentle/20 rounded-full px-4 py-2 border border-white/20">
                    <span className="font-semibold text-sm">🎯 Custom AI Tutor</span>
                </div>
                
                <div className="space-y-4">
                    <h2 className="text-2xl lg:text-3xl font-bold leading-tight">
                        Build Your Dream
                        <br />
                        <span className="bg-gradient-to-r from-accent-warm to-white bg-clip-text text-transparent">
                            Learning Buddy 🤖
                        </span>
                    </h2>
                    <p className="text-white/80 leading-relaxed max-w-sm mx-auto">
                        Design a personalized AI companion with custom personality, voice, and teaching style that fits your learning needs perfectly.
                    </p>
                </div>

                <div className="relative my-4">
                    <div className="w-24 h-24 bg-white/15 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 animate-float">
                        <div className="w-16 h-16 bg-gradient-to-br from-accent-warm to-accent-gentle rounded-full flex items-center justify-center">
                            <span className="text-2xl">🎨</span>
                        </div>
                    </div>
                </div>

                <Link href="/companions/new" className="w-full">
                    <button className="w-full bg-white text-primary font-bold px-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white/95 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 border-2 border-white/20">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <span>Create Your Companion</span>
                        <svg 
                            className="w-5 h-5 transition-transform duration-300 hover:translate-x-1" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </Link>
            </div>
        </section>
    )
}
export default Cta
