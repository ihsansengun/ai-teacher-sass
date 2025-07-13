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
                    <div className="font-semibold text-lg text-text-primary hidden sm:block">
                        Your AI Teacher
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
