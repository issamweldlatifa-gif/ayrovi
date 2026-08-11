import React from 'react';
import { ShoppingBag, ArrowRightLeft, Sparkles } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, cartTotal, onOpenCart }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#332266]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#5025d1] via-[#673de6] to-[#7e57ff] flex items-center justify-center font-black text-white text-xl shadow-lg shadow-[#673de6]/30">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-wider text-white">AYROVI</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#673de6]/20 text-[#a384ff] border border-[#673de6]/30">
                <Sparkles className="w-2.5 h-2.5 mr-1" />
                Tunisie 🇹🇳
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden xs:block">Shopping International en Dinars Tunisiens</p>
          </div>
        </div>

        {/* Live Fixed Benchmark Exchange Rate Badge */}
        <div className="hidden md:flex items-center gap-3 bg-[#170e33]/90 border border-[#332266] px-4 py-2 rounded-2xl text-xs font-semibold text-slate-300">
          <ArrowRightLeft className="w-4 h-4 text-[#a384ff]" />
          <div className="flex items-center gap-2">
            <span>Taux garanti :</span>
            <span className="text-white bg-[#24164f] px-2.5 py-0.5 rounded-lg border border-[#442c82] font-bold">1 EUR / USD = 4.00 DT</span>
            <span className="text-white bg-[#24164f] px-2.5 py-0.5 rounded-lg border border-[#442c82] font-bold">100 JPY = 2.65 DT</span>
          </div>
        </div>

        {/* Unified Cart Button */}
        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-2.5 hostinger-btn active:scale-95 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-[#673de6]/25 transition-all duration-200"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-[#5025d1] rounded-full text-[11px] font-black flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </div>
          <div className="text-left hidden xs:block">
            <span className="block text-[10px] text-purple-200/90 font-medium">Mon Panier</span>
            <span className="block font-black leading-tight text-white">{cartTotal > 0 ? `${cartTotal.toFixed(2)} DT` : '0.00 DT'}</span>
          </div>
        </button>

      </div>
    </header>
  );
};
