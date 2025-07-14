"use client";
import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { subjects } from "@/constants";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";

const SubjectFilter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("subject") || "";

    const [subject, setSubject] = useState(query);

    // Update subject when URL query changes
    useEffect(() => {
        if (query !== subject) {
            setSubject(query);
        }
    }, [query]);

    useEffect(() => {
        // Skip the effect if the subject hasn't changed from the URL query
        // or if it's the initial render with no subject selected
        if ((subject === query) || (subject === "" && query === "")) return;

        let newUrl = "";
        if (subject === "all") {
            newUrl = removeKeysFromUrlQuery({
                params: searchParams.toString(),
                keysToRemove: ["subject"],
            });
        } else {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "subject",
                value: subject,
            });
        }
        router.push(newUrl, { scroll: false });
    }, [subject]);

    return (
        <Select onValueChange={setSubject} value={subject}>
            <SelectTrigger className="glass-panel rounded-xl items-center flex gap-3 px-4 py-3 h-[52px] border border-glass-border hover:border-neural-purple/30 focus-within:border-neural-purple/50 transition-all duration-300 capitalize min-w-[160px] text-neural-800">
                <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent className="glass-panel border border-glass-border rounded-xl shadow-lg backdrop-blur-16">
                <SelectItem value="all" className="text-neural-800 hover:bg-neural-100 focus:bg-neural-100">All subjects</SelectItem>
                {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject} className="capitalize text-neural-800 hover:bg-neural-100 focus:bg-neural-100">
                        {subject}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default SubjectFilter;
