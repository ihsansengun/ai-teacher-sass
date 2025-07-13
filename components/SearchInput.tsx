'use client';

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import Image from "next/image";
import {formUrlQuery, removeKeysFromUrlQuery} from "@jsmastery/utils";

const SearchInput = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('topic') || '';

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if(searchQuery) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: "topic",
                    value: searchQuery,
                });

                router.push(newUrl, { scroll: false });
            } else {
                if(pathname === '/companions') {
                    const newUrl = removeKeysFromUrlQuery({
                        params: searchParams.toString(),
                        keysToRemove: ["topic"],
                    });

                    router.push(newUrl, { scroll: false });
                }
            }
        }, 500)
    }, [searchQuery, router, searchParams, pathname]);

    return (
        <div className="relative border border-[#5195ED]/20 hover:border-[#5195ED]/30 focus-within:border-[#5195ED]/50 rounded-2xl items-center flex gap-3 px-4 py-3 h-fit bg-white transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-[#5195ED]/10 focus-within:shadow-md focus-within:shadow-[#5195ED]/15">
            <Image src="/icons/search.svg" alt="search" width={18} height={18} className="opacity-60" />
            <input
                placeholder="Search companions..."
                className="outline-none bg-transparent text-text-primary placeholder:text-text-tertiary flex-1 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    )
}
export default SearchInput
