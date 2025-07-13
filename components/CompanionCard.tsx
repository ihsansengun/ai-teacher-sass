"use client";
import { removeBookmark } from "@/lib/actions/companion.actions";
import { addBookmark } from "@/lib/actions/companion.actions";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
  bookmarked: boolean;
}

const CompanionCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
  bookmarked,
}: CompanionCardProps) => {
  const pathname = usePathname();
  const handleBookmark = async () => {
    try {
      if (bookmarked) {
        await removeBookmark(id, pathname);
      } else {
        await addBookmark(id, pathname);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      // You could add a toast notification here in the future
    }
  };
  
  return (
    <article className="companion-card floating-particles relative">
      {/* Background decoration */}
      <div className="absolute top-4 right-4 w-20 h-20 opacity-5 pointer-events-none">
        <div 
          className="w-full h-full rounded-full"
          style={{ 
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`
          }}
        />
      </div>
      
      {/* Header with badge and bookmark */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="subject-badge">{subject}</div>
        <div className="flex items-center gap-2">
          {/* Difficulty indicator */}
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((level) => (
              <div 
                key={level}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  level <= 2 ? 'bg-primary/40' : 'bg-border-soft'
                }`}
              />
            ))}
          </div>
          <button 
            className={`companion-bookmark ${bookmarked ? 'bookmarked' : ''}`}
            onClick={handleBookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Image
              src={bookmarked ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"}
              alt="bookmark"
              width={16}
              height={20}
              className="transition-transform duration-300 hover:scale-110"
            />
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex items-start gap-4 mb-6 relative z-10">
        {/* Subject icon */}
        <div className="relative">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/50 animate-float"
            style={{ 
              background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
              boxShadow: `0 6px 20px 0 ${color}20`
            }}
          >
            <Image
              src={`/icons/${subject}.svg`}
              alt={subject}
              width={28}
              height={28}
              style={{ filter: `brightness(0) saturate(100%) hue-rotate(0deg) contrast(200%)` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-bold text-text-primary line-clamp-2 leading-tight">
            {name}
          </h3>
          <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
            {topic}
          </p>
          
          {/* Meta info */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/15 to-primary-soft/15 flex items-center justify-center border border-primary/10">
                <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-text-tertiary">
                {duration}min
              </span>
            </div>
            
            {/* Popularity indicator */}
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-accent-warm rounded-full animate-pulse"></div>
              <span className="text-xs text-accent-warm font-medium">Popular</span>
            </div>
          </div>
        </div>
      </div>

      {/* Launch button */}
      <Link href={`/companions/${id}`} className="w-full mt-auto relative z-10">
        <button className="btn-primary w-full justify-center group">
          <span>Launch Lesson</span>
          <svg 
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </Link>
    </article>
  );
};

export default CompanionCard;
