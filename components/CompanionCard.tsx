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
    }
  };

  return (
    <article className="companion-card group relative">
      {/* Neural Background Pattern */}
      <div className="absolute inset-0 neural-pattern opacity-20 rounded-2xl pointer-events-none"></div>
      
      {/* Floating Neural Orbs */}
      <div className="absolute top-4 right-4 w-16 h-16 opacity-30 pointer-events-none">
        <div className="w-3 h-3 bg-neural-purple/60 rounded-full absolute top-0 right-0 animate-bounce"></div>
        <div className="w-2 h-2 bg-neural-blue/40 rounded-full absolute bottom-2 left-2 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="w-1.5 h-1.5 bg-neural-green/50 rounded-full absolute top-1/2 left-1/2 animate-ping" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        {/* Subject Badge */}
        <div className="glass-panel rounded-full px-4 py-2 border border-neural-purple/20">
          <span className="text-sm font-bold text-neural-purple capitalize tracking-wide">
            {subject}
          </span>
        </div>
        
        {/* Bookmark & Difficulty */}
        <div className="flex items-center gap-3">
          {/* Neural Difficulty Indicator */}
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((level) => (
              <div 
                key={level}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  level <= 2 
                    ? 'bg-gradient-to-r from-neural-purple to-neural-blue shadow-sm' 
                    : 'bg-neural-200'
                }`}
              />
            ))}
          </div>
          
          {/* Neural Bookmark Button */}
          <button 
            className={`relative group/bookmark w-10 h-10 glass-panel rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 ${
              bookmarked 
                ? 'bg-gradient-to-br from-neural-purple/20 to-neural-blue/20 border-neural-purple/40' 
                : 'border-neural-200 hover:border-neural-purple/30'
            }`}
            onClick={handleBookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neural-purple/10 to-neural-blue/10 rounded-xl opacity-0 group-hover/bookmark:opacity-100 transition-opacity duration-300"></div>
            <Image
              src={bookmarked ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"}
              alt="bookmark"
              width={18}
              height={22}
              className="relative z-10 transition-transform duration-300 group-hover/bookmark:scale-110"
              style={{
                filter: bookmarked 
                  ? 'hue-rotate(220deg) saturate(150%) brightness(1.2)' 
                  : 'none'
              }}
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-start gap-5 mb-6 relative z-10">
        {/* Neural Subject Icon */}
        <div className="relative group/icon">
          <div className="absolute inset-0 bg-gradient-to-br from-neural-purple/20 to-neural-blue/20 rounded-2xl blur-sm opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
          <div className="relative neomorph-raised w-18 h-18 rounded-2xl flex items-center justify-center">
            <div className="w-16 h-16 glass-panel rounded-xl flex items-center justify-center border border-neural-200/50">
              <Image
                src={`/icons/${subject}.svg`}
                alt={subject}
                width={32}
                height={32}
                className="filter-none opacity-80 group-hover/icon:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>
        </div>

        {/* Content Text */}
        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-bold text-neural-900 line-clamp-2 leading-tight group-hover:text-neural-purple transition-colors duration-300">
            {name}
          </h3>
          <p className="text-sm text-neural-600 line-clamp-3 leading-relaxed">
            {topic}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between pt-2">
            {/* Duration */}
            <div className="flex items-center gap-2">
              <div className="neomorph-inset w-6 h-6 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-neural-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-neural-600">
                {duration}min
              </span>
            </div>

            {/* Neural Activity Indicator */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-neural-green rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 bg-neural-green rounded-full animate-ping"></div>
              </div>
              <span className="text-xs text-neural-green font-semibold">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Neural Connection Lines */}
      <div className="absolute bottom-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neural-purple/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Launch Button */}
      <Link href={`/companions/${id}`} className="w-full relative z-10">
        <button className="btn-neural w-full justify-center text-base font-semibold group/launch relative overflow-hidden">
          {/* Button background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-neural-purple via-neural-blue to-neural-green opacity-0 group-hover/launch:opacity-20 transition-opacity duration-300 blur-sm"></div>
          
          <span className="relative z-10 flex items-center gap-3">
            Launch Session
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover/launch:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </span>
        </button>
      </Link>
    </article>
  );
};

export default CompanionCard;
