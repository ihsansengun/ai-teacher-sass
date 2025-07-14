import Image from "next/image";
import Link from "next/link";

const Cta = () => {
    return (
        <aside className="w-full lg:w-80 lg:sticky lg:top-24 h-fit">
            <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                {/* Neural Background Pattern */}
                <div className="absolute inset-0 neural-pattern opacity-30 rounded-2xl"></div>
                
                {/* Floating Neural Orbs */}
                <div className="absolute top-4 right-4 w-16 h-16 opacity-20 pointer-events-none">
                    <div className="w-3 h-3 bg-neural-purple/60 rounded-full absolute top-0 right-0 animate-pulse"></div>
                    <div className="w-2 h-2 bg-neural-blue/40 rounded-full absolute bottom-2 left-2 animate-ping" style={{animationDelay: '0.5s'}}></div>
                    <div className="w-1.5 h-1.5 bg-neural-green/50 rounded-full absolute top-1/2 left-1/2 animate-bounce" style={{animationDelay: '1s'}}></div>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center gap-6">
                    {/* Badge */}
                    <div className="glass-panel rounded-full px-4 py-2 border border-neural-purple/30">
                        <span className="text-sm font-bold gradient-neural">Custom AI Tutor</span>
                    </div>

                    {/* Title */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold gradient-neural leading-tight">
                            Build Your Dream
                            <br />
                            Learning Buddy
                        </h2>
                        <p className="text-neural-600 text-sm leading-relaxed">
                            Design a personalized AI companion with custom personality, voice, and teaching style.
                        </p>
                    </div>

                    {/* Neural Brain Icon */}
                    <div className="relative my-4">
                        <div className="w-20 h-20 glass-panel rounded-full flex items-center justify-center border-2 border-neural-purple/20">
                            <div className="w-16 h-16 bg-gradient-to-br from-neural-purple/20 via-neural-blue/20 to-neural-green/20 rounded-full flex items-center justify-center">
                                <Image
                                    src="/icons/logo.png"
                                    alt="AI Teacher Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        {/* Neural connections */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-neural-orange rounded-full animate-pulse"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-neural-green rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                    </div>

                    {/* CTA Button */}
                    <Link href="/companions/new" className="w-full cursor-pointer">
                        <button className="btn-neural w-full text-center py-3 font-semibold group relative overflow-hidden cursor-pointer">
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                <div className="neomorph-inset w-6 h-6 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-neural-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span>Create Companion</span>
                                <svg 
                                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>
                    </Link>

                    {/* Features List */}
                    <div className="w-full space-y-2 text-left">
                        <div className="flex items-center gap-3 text-xs text-neural-600">
                            <div className="w-1.5 h-1.5 bg-neural-green rounded-full"></div>
                            <span>Custom voice & personality</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-neural-600">
                            <div className="w-1.5 h-1.5 bg-neural-blue rounded-full"></div>
                            <span>Personalized teaching style</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-neural-600">
                            <div className="w-1.5 h-1.5 bg-neural-purple rounded-full"></div>
                            <span>Any subject expertise</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
export default Cta
