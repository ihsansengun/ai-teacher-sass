import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavItems from "@/components/NavItems";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link href="/">
                <div className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                        <Image
                            src="/icons/logo.png"
                            alt="Your AI Teacher"
                            width={70}
                            height={70}
                            className="transition-transform duration-200 hover:scale-105"
                        />
                    </div>
                    <div className="relative group">
                        <span className="font-semibold text-xs sm:text-sm md:text-lg gradient-text-primary relative z-10 tracking-wide flex items-center">
                            <span>Your AI</span>
                            <span className="inline-block w-1 h-1 bg-accent-soft rounded-full mx-0.5 sm:mx-1 animate-pulse"></span>
                            <span className="font-bold tracking-wider">Teacher</span>
                        </span>
                        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-accent-soft/30 to-primary-soft/30 rounded-full animate-pulse-glow transform transition-all duration-300 group-hover:h-1.5 group-hover:shadow-sm group-hover:shadow-primary/20"></div>
                    </div>
                </div>
            </Link>
            <div className="flex items-center gap-6 lg:gap-8">
                <NavItems />
                <SignedOut>
                    <SignInButton>
                        <button className="btn-signin">
                            Sign In
                        </button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <div className="relative">
                        <UserButton 
                            appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9 ring-2 ring-border-subtle hover:ring-primary/50 transition-all duration-200"
                                }
                            }}
                        />
                    </div>
                </SignedIn>
            </div>
        </nav>
    )
}

export default Navbar
