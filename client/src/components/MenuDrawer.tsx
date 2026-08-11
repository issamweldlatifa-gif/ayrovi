import React from 'react';
import { X, Sparkles, ShoppingBag, Bot, Store, MessageSquare, ArrowRightLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import { FigLogoIcon, LensBoxIcon, AiLogoIcon } from './Icons';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProductDrawer: () => void;
  onOpenAiDrawer: () => void;
  onOpenCart: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenProductDrawer,
  onOpenAiDrawer,
  onOpenCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#0f0730]/60 backdrop-blur-sm transition-opacity"
      />

      {/* Side Drawer from Left */}
      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-xs sm:max-w-sm bg-white shadow-2xl border-r border-slate-100 flex flex-col justify-between p-6 animate-in slide-in-from-left duration-300">
          
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FigLogoIcon className="w-8 h-8 drop-shadow-xs" />
                <span className="text-xl font-extrabold text-[#1d2130]">AYROVI</span>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1d2130] flex items-center justify-center transition-colors cursor-pointer"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Exchange rate banner */}
            <div className="bg-[#f8f9fe] border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#673de6]">
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Taux de change garanti</span>
              </div>
              <p className="text-xs font-extrabold text-[#1d2130]">1 EUR / USD = 4.00 DT</p>
            </div>

            {/* Navigation items */}
            <div className="space-y-1.5 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenProductDrawer();
                }}
                className="w-full p-3.5 rounded-2xl bg-[#673de6]/10 hover:bg-[#673de6] text-[#673de6] hover:text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <LensBoxIcon className="w-5 h-5 text-[#673de6] group-hover:text-white" />
                  <span>Nouvelle Commande (Lens)</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenAiDrawer();
                }}
                className="w-full p-3.5 rounded-2xl bg-[#f8f9fe] hover:bg-[#673de6] text-[#1d2130] hover:text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <AiLogoIcon className="w-5 h-5 text-[#673de6] group-hover:text-white" />
                  <span>Rofio AI Assistant</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenCart();
                }}
                className="w-full p-3.5 rounded-2xl bg-[#f8f9fe] hover:bg-[#673de6] text-[#1d2130] hover:text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#673de6] group-hover:text-white" />
                  <span>Mon Panier</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Footer of Side Drawer */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <a
              href="https://wa.me/?text=Bonjour%20AYROVI%2C%20je%20souhaite%20des%20renseignements"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3.5 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Support WhatsApp 7j/7</span>
            </a>
            <p className="text-[10px] text-slate-400 text-center">
              AYROVI — Shopping international en Tunisie 🇹🇳
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
