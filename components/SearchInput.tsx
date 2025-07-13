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
        <div className="relative border-2 border-border-soft hover:border-primary/20 focus-within:border-primary/40 rounded-2xl items-center flex gap-3 px-4 py-3 h-fit bg-gradient-to-r from-surface to-surface-soft transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 focus-within:shadow-lg focus-within:shadow-primary/10">
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
