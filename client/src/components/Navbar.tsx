import React from 'react';
import { ShoppingBag, ArrowRightLeft, Sparkles } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, cartTotal, onOpenCart }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center font-black text-white text-xl sm:text-2xl shadow-lg shadow-brand-500/25">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-wider text-white">AYROVI</span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                <Sparkles className="w-2.5 h-2.5 ml-1" />
                تونس 🇹🇳
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden xs:block">الشراء الدولي الموحد بالدينار التونسي</p>
          </div>
        </div>

        {/* Live Fixed Benchmark Exchange Rate Badge */}
        <div className="hidden md:flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-2xl text-xs font-semibold text-slate-300">
          <ArrowRightLeft className="w-4 h-4 text-brand-400" />
          <div className="flex items-center gap-2">
            <span>سعر الصرف المعتمد:</span>
            <span className="text-white bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700 font-bold">1 EUR / USD = 4.00 د.ت</span>
            <span className="text-white bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700 font-bold">100 JPY = 2.65 د.ت</span>
          </div>
        </div>

        {/* Unified Cart Button */}
        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-2.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 active:scale-95 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/20 transition-all duration-200"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-brand-600 rounded-full text-[11px] font-black flex items-center justify-center shadow-md animate-scale">
                {cartCount}
              </span>
            )}
          </div>
          <div className="text-right hidden xs:block">
            <span className="block text-[10px] text-brand-100/90 font-medium">السلة الموحدة</span>
            <span className="block font-black leading-tight text-white">{cartTotal > 0 ? `${cartTotal.toFixed(2)} د.ت` : '0.00 د.ت'}</span>
          </div>
        </button>

      </div>
    </header>
  );
};
