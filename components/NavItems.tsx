'use client';

import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

const navItems = [
    { label:'Home', href: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Companions', href: '/companions', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'My Journey', href: '/my-journey', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
]

interface NavItemsProps {
    mobile?: boolean;
    onItemClick?: () => void;
}

const NavItems = ({ mobile = false, onItemClick }: NavItemsProps) => {
    const pathname = usePathname();

    if (mobile) {
        return (
            <div className="space-y-2">
                {navItems.map(({ label, href, icon }) => (
                    <Link
                        href={href}
                        key={label}
                        onClick={onItemClick}
                        className={cn(
                            "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
                            pathname === href 
                                ? 'bg-gradient-to-r from-neural-purple to-neural-blue text-white shadow-lg' 
                                : 'text-neural-600 hover:text-neural-900 glass-panel hover:bg-neural-50'
                        )}
                    >
                        <div className={cn(
                            "w-5 h-5 transition-colors duration-300",
                            pathname === href ? 'text-white' : 'text-neural-purple'
                        )}>
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                            </svg>
                        </div>
                        <span className="font-semibold">{label}</span>
                        {pathname === href && (
                            <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                        )}
                    </Link>
                ))}
            </div>
        )
    }

    return (
        <nav className="flex items-center gap-2">
            {navItems.map(({ label, href }) => (
                <Link
                    href={href}
                    key={label}
                    className={cn(
                        "relative px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ease-out hover:scale-[1.02] will-change-transform",
                        pathname === href 
                            ? 'text-white bg-gradient-to-r from-neural-purple to-neural-blue shadow-lg' 
                            : 'text-neural-800 hover:text-neural-900 glass-panel hover:bg-neural-50 border border-neural-200/50 hover:border-neural-300'
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
