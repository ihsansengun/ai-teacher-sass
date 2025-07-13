'use client';

import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

const navItems = [
    { label:'Home', href: '/' },
    { label: 'Companions', href: '/companions' },
    { label: 'My Journey', href: '/my-journey' },
]

const NavItems = () => {
    const pathname = usePathname();

    return (
        <nav className="hidden md:flex items-center gap-2">
            {navItems.map(({ label, href }) => (
                <Link
                    href={href}
                    key={label}
                    className={cn(
                        "relative px-4 py-2.5 text-sm font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10",
                        pathname === href 
                            ? 'text-white bg-gradient-to-r from-primary to-primary-soft shadow-lg' 
                            : 'text-text-secondary hover:text-primary hover:bg-primary/8 border-2 border-transparent hover:border-primary/20'
                    )}
                >
                    {label}
                    {pathname === href && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                </Link>
            ))}
        </nav>
    )
}

export default NavItems
