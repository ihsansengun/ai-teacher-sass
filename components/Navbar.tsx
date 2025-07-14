'use client';

import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavItems from "@/components/NavItems";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <nav className="navbar">
                {/* Logo Section */}
                <Link href="/">
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-neural-purple/20 via-neural-blue/20 to-neural-green/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative w-10 h-10 md:w-12 md:h-12 glass-panel rounded-full p-1.5 border border-glass-border">
                                <Image
                                    src="/icons/logo.png"
                                    alt="Your AI Teacher"
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="font-bold text-lg gradient-neural tracking-wide">
                                NeuralTeach
                            </h1>
                            <div className="flex items-center gap-1 mt-0.5">
                                <div className="w-1 h-1 bg-neural-purple rounded-full animate-pulse"></div>
                                <div className="w-1 h-1 bg-neural-blue rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                                <div className="w-1 h-1 bg-neural-green rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                            </div>
                        </div>
                    </div>
                </Link>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <NavItems />
                    
                    <SignedOut>
                        <SignInButton>
                            <button className="btn-glass text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-neural-purple to-neural-blue rounded-full"></div>
                                    Sign In
                                </div>
                            </button>
                        </SignInButton>
                    </SignedOut>
                    
                    <SignedIn>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-neural-purple/30 to-neural-blue/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative glass-panel rounded-full p-1">
                                <UserButton 
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-8 h-8 ring-2 ring-glass-border hover:ring-neural-purple/50 transition-all duration-300"
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </SignedIn>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-2">
                    <SignedIn>
                        <div className="glass-panel rounded-full p-1">
                            <UserButton 
                                appearance={{
                                    elements: {
                                        avatarBox: "w-7 h-7 ring-1 ring-glass-border"
                                    }
                                }}
                            />
                        </div>
                    </SignedIn>
                    
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="glass-panel w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
                        aria-label="Toggle menu"
                    >
                        <div className="relative w-5 h-5">
                            <span className={cn(
                                "absolute top-1.5 left-0 w-5 h-0.5 bg-neural-purple rounded-full transition-all duration-300",
                                isMenuOpen && "rotate-45 top-2.5"
                            )}></span>
                            <span className={cn(
                                "absolute top-2.5 left-0 w-5 h-0.5 bg-neural-blue rounded-full transition-all duration-300",
                                isMenuOpen && "opacity-0"
                            )}></span>
                            <span className={cn(
                                "absolute top-3.5 left-0 w-5 h-0.5 bg-neural-green rounded-full transition-all duration-300",
                                isMenuOpen && "-rotate-45 top-2.5"
                            )}></span>
                        </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "md:hidden fixed inset-0 z-50 transition-all duration-300",
                isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-neural-900/50 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                ></div>
                
                {/* Menu Panel */}
                <div className={cn(
                    "absolute top-0 right-0 w-80 max-w-[85vw] h-full glass-panel border-l border-glass-border transition-transform duration-300",
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                )}>
                    <div className="p-6 space-y-6">
                        {/* Close Button */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold gradient-neural">Menu</h2>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="w-8 h-8 glass-panel rounded-full flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 text-neural-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="space-y-3">
                            <NavItems mobile onItemClick={() => setIsMenuOpen(false)} />
                        </div>

                        {/* Sign In Section */}
                        <SignedOut>
                            <div className="pt-4 border-t border-glass-border">
                                <SignInButton>
                                    <button 
                                        className="btn-neural w-full justify-center"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 bg-white/80 rounded-full"></div>
                                            Sign In
                                        </div>
                                    </button>
                                </SignInButton>
                            </div>
                        </SignedOut>

                        {/* Neural Pattern Background */}
                        <div className="absolute bottom-6 left-6 right-6 h-20 neural-pattern opacity-20 rounded-xl"></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar
