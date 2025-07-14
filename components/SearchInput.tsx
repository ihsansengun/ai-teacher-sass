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

    const [searchQuery, setSearchQuery] = useState(query);

    // Update searchQuery when URL query changes
    useEffect(() => {
        if (query !== searchQuery) {
            setSearchQuery(query);
        }
    }, [query]);

    useEffect(() => {
        // Skip the effect if the searchQuery matches the URL query
        if (searchQuery === query) return;

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

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, pathname]);

    return (
        <div className="relative glass-panel rounded-xl items-center flex gap-3 px-4 py-3 h-[52px] transition-all duration-300 border border-glass-border hover:border-neural-purple/30 focus-within:border-neural-purple/50">
            <Image src="/icons/search.svg" alt="search" width={18} height={18} className="opacity-60" />
            <input
                placeholder="Search companions..."
                className="outline-none bg-transparent text-neural-800 placeholder:text-neural-500 flex-1 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    )
}
export default SearchInput
