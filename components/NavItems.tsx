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
        <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ label, href }) => (
                <Link
                    href={href}
                    key={label}
                    className={cn(
                        "relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-muted",
                        pathname === href 
                            ? 'text-primary bg-primary/5' 
                            : 'text-text-secondary hover:text-text-primary'
                    )}
                >
                    {label}
                    {pathname === href && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                    )}
                </Link>
            ))}
        </nav>
    )
}

export default NavItems
