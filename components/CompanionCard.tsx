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
      {/* Header with badge and bookmark */}
      <div className="flex justify-between items-start mb-4">
        <div className="subject-badge">{subject}</div>
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
            className="transition-transform duration-200 hover:scale-110"
          />
        </button>
      </div>

      {/* Subject icon */}
      <div className="relative mb-4">
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/50 animate-float"
          style={{ 
            background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`,
            boxShadow: `0 4px 14px 0 ${color}30`
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
      <div className="space-y-3 mb-6">
        <h3 className="text-xl font-semibold text-text-primary line-clamp-2 leading-tight">
          {name}
        </h3>
        <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
          {topic}
        </p>
        
        {/* Duration */}
        <div className="flex items-center gap-2 pt-2">
          <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Image
              src="/icons/clock.svg"
              alt="duration"
              width={12}
              height={12}
              className="opacity-60"
            />
          </div>
          <span className="text-xs font-medium text-text-tertiary">
            {duration} minutes
          </span>
        </div>
      </div>

      {/* Launch button */}
      <Link href={`/companions/${id}`} className="w-full mt-auto">
        <button className="btn-primary w-full justify-center">
          <span>Launch Lesson</span>
          <svg 
            className="w-4 h-4 transition-transform duration-200 hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </Link>
    </article>
  );
};

export default CompanionCard;
