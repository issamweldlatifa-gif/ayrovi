import React from 'react';
import { ArrowRight } from 'lucide-react';

interface TopAnnouncementBarProps {
  onLearnMore?: () => void;
}

export const TopAnnouncementBar: React.FC<TopAnnouncementBarProps> = ({ onLearnMore }) => {
  return (
    <div className="bg-[#fbbf24] text-[#1d2130] py-2 px-4 text-center text-xs sm:text-sm font-bold tracking-tight z-50 relative flex items-center justify-center gap-2">
      <span>Taux fixe garanti : <strong>1 EUR / USD = 4.00 DT</strong> — Dédouanement & Livraison 24 Gouvernorats</span>
      {onLearnMore && (
        <button
          onClick={onLearnMore}
          className="hidden sm:inline-flex items-center text-xs underline font-extrabold hover:text-[#5025d1] ml-1 transition-colors cursor-pointer"
        >
          <span>En savoir plus</span>
          <ArrowRight className="w-3 h-3 ml-0.5" />
        </button>
      )}
    </div>
  );
};
