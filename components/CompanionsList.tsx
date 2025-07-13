
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
                <div className="text-center py-16 space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary-soft/10 rounded-full flex items-center justify-center mx-auto border-2 border-primary/5">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/15 to-primary-soft/15 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-text-primary mb-3">🚀 Ready to start learning?</h3>
                        <p className="text-text-secondary max-w-md mx-auto leading-relaxed">Your learning journey begins here! Choose a tutor and start your first session to see your progress tracked in this space.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {companions.map(({id, subject, name, topic, duration}, index) => (
                        <div key={`${id}-${index}`}>
                            <Link href={`/companions/${id}`}>
                                <div className="flex items-center gap-5 p-5 rounded-2xl border-2 border-border-soft hover:border-primary/20 hover:bg-surface-soft/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                                    {/* Avatar */}
                                    <div 
                                        className="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-2xl shadow-lg flex-shrink-0 border-2 border-white/50" 
                                        style={{ 
                                            background: `linear-gradient(135deg, ${getSubjectColor(subject)}15, ${getSubjectColor(subject)}25)`,
                                            boxShadow: `0 4px 12px ${getSubjectColor(subject)}20`
                                        }}
                                    >
                                        <Image
                                            src={`/icons/${subject}.svg`}
                                            alt={subject}
                                            width={28}
                                            height={28}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-text-primary hover:text-primary transition-colors duration-300 mb-2 truncate text-lg">
                                            {name}
                                        </h3>
                                        <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                                            {topic}
                                        </p>
                                    </div>

                                    {/* Meta */}
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        {/* Subject badge - hidden on mobile */}
                                        <div className="hidden md:block">
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/12 text-primary border border-primary/20">
                                                {subject}
                                            </span>
                                        </div>

                                        {/* Duration */}
                                        <div className="flex items-center gap-2 text-sm text-text-tertiary">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/15 to-primary-soft/15 flex items-center justify-center border border-primary/10">
                                                <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <span className="font-semibold">{duration}m</span>
                                        </div>

                                        {/* Arrow */}
                                        <div className="w-8 h-8 rounded-full bg-primary/8 flex items-center justify-center transition-all duration-300 hover:bg-primary/15 hover:scale-110">
                                            <svg 
                                                className="w-4 h-4 text-primary transition-transform duration-300 hover:translate-x-0.5" 
                                                fill="none" 
                                                viewBox="0 0 24 24" 
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
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
