import React, { useState, useEffect } from 'react';
import { Menu, User } from 'lucide-react';
import { FigLogoIcon } from './Icons';

interface NavbarProps {
  onOpenMenuDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMenuDrawer }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white border-b border-slate-200/90 shadow-sm text-[#1d2130]'
          : 'bg-transparent text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* LEFT (يسار): Menu Icon (Opens Side Drawer) */}
        <button
          onClick={onOpenMenuDrawer}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all shadow-xs cursor-pointer ${
            isScrolled
              ? 'bg-[#f8f9fe] text-[#1d2130] hover:bg-slate-200 border border-slate-200'
              : 'bg-white/20 text-white hover:bg-white/30 border border-white/25 backdrop-blur-md'
          }`}
          aria-label="Menu"
          title="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* CENTER: AYROVI Logo with Vector Fig Icon */}
        <div className="flex items-center gap-2.5">
          <FigLogoIcon className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-sm" />
          <span
            className={`text-2xl sm:text-3xl font-black tracking-tight transition-colors ${
              isScrolled ? 'text-[#1d2130]' : 'text-white drop-shadow-md'
            }`}
          >
            AYROVI
          </span>
        </div>

        {/* RIGHT (يمين): Profile Avatar */}
        <button
          onClick={() => alert("Profil Client AYROVI — ID: " + (localStorage.getItem('ayrovi_session_id') || 'Client'))}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#ffc24b] to-[#ff6b9a] shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          title="Mon Profil AYROVI"
          aria-label="Profil"
        >
          <div className="w-full h-full rounded-full bg-[#1e0b4b] flex items-center justify-center text-white">
            <User className="w-5 h-5 text-[#ffc24b]" />
          </div>
        </button>

      </div>
    </header>
  );
};
