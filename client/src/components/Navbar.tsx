import React from 'react';
import { ShoppingBag, ArrowRightLeft, Sparkles } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, cartTotal, onOpenCart }) => {
  return (
    <header className="sticky top-0 z-40 w-full transparent-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#673de6] flex items-center justify-center font-black text-white text-xl shadow-md shadow-[#673de6]/25">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1d2130]">
                AYROVI
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#673de6]/10 text-[#673de6] border border-[#673de6]/20">
                <Sparkles className="w-2.5 h-2.5 mr-1" />
                Tunisie 🇹🇳
              </span>
            </div>
            <p className="text-[11px] text-[#6b7280] font-medium hidden xs:block">
              Shopping International en Dinars Tunisiens
            </p>
          </div>
        </div>

        {/* Fixed Benchmark Exchange Rate Badge */}
        <div className="hidden md:flex items-center gap-3 bg-[#f4f5fa] border border-[#e5e7eb] px-4 py-2 rounded-2xl text-xs font-semibold text-[#4b5563]">
          <ArrowRightLeft className="w-4 h-4 text-[#673de6]" />
          <div className="flex items-center gap-2">
            <span>Taux de change garanti :</span>
            <span className="text-[#1d2130] bg-white px-2.5 py-0.5 rounded-lg border border-[#e5e7eb] font-bold shadow-xs">
              1 EUR / USD = 4.00 DT
            </span>
            <span className="text-[#1d2130] bg-white px-2.5 py-0.5 rounded-lg border border-[#e5e7eb] font-bold shadow-xs">
              100 JPY = 2.65 DT
            </span>
          </div>
        </div>

        {/* Action Button: Cart */}
        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-2.5 hostinger-btn active:scale-95 text-white px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-[#673de6] rounded-full text-[11px] font-black flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </div>
          <div className="text-left hidden xs:block">
            <span className="block text-[10px] text-purple-100 font-medium leading-none mb-0.5">Mon Panier</span>
            <span className="block font-black leading-tight text-white">{cartTotal > 0 ? `${cartTotal.toFixed(2)} DT` : '0.00 DT'}</span>
          </div>
        </button>

      </div>
    </header>
  );
};
