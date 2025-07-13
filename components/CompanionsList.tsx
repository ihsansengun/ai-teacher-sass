
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {cn, getSubjectColor} from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface CompanionsListProps {
    title: string;
    companions?: Companion[];
    classNames?: string;
}

const CompanionsList = ({ title, companions, classNames }: CompanionsListProps) => {
    return (
        <article className={cn('companion-list', classNames)}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-2xl lg:text-3xl text-text-primary">{title}</h2>
                {companions && companions.length > 0 && (
                    <span className="text-sm text-text-tertiary bg-muted px-3 py-1 rounded-full">
                        {companions.length} {companions.length === 1 ? 'session' : 'sessions'}
                    </span>
                )}
            </div>

            {!companions || companions.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-text-primary mb-2">No sessions yet</h3>
                        <p className="text-text-secondary">Start your first learning session to see your history here.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {companions.map(({id, subject, name, topic, duration}, index) => (
                        <div key={`${id}-${index}`}>
                            <Link href={`/companions/${id}`}>
                                <div className="flex items-center gap-4 p-4 rounded-xl border border-border-subtle hover:border-border hover:bg-muted/50 transition-all duration-200 hover:shadow-sm">
                                    {/* Avatar */}
                                    <div 
                                        className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-xl shadow-sm flex-shrink-0" 
                                        style={{ backgroundColor: getSubjectColor(subject) + "20" }}
                                    >
                                        <Image
                                            src={`/icons/${subject}.svg`}
                                            alt={subject}
                                            width={24}
                                            height={24}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-text-primary hover:text-primary transition-colors duration-200 mb-1 truncate">
                                            {name}
                                        </h3>
                                        <p className="text-sm text-text-secondary line-clamp-2">
                                            {topic}
                                        </p>
                                    </div>

                                    {/* Meta */}
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        {/* Subject badge - hidden on mobile */}
                                        <div className="hidden md:block">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                {subject}
                                            </span>
                                        </div>

                                        {/* Duration */}
                                        <div className="flex items-center gap-1.5 text-sm text-text-tertiary">
                                            <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <span className="font-medium">{duration}m</span>
                                        </div>

                                        {/* Arrow */}
                                        <svg 
                                            className="w-4 h-4 text-text-tertiary transition-transform duration-200 hover:translate-x-1" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </article>
    )
}

export default CompanionsList;
