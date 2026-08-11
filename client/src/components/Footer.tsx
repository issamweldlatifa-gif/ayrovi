import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[#332266]/80 bg-[#0a0616]/90 pt-12 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-xs">
          
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5025d1] to-[#7e57ff] flex items-center justify-center font-black text-white text-base">
                A
              </div>
              <span className="text-lg font-black text-white">AYROVI</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              La plateforme unifiée pour vos achats internationaux en Dinars Tunisiens. Commandez facilement depuis SHEIN, Amazon, TEMU et AliExpress en toute transparence et sans carte bancaire internationale.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Boutiques Partenaires</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>👗 SHEIN International</li>
              <li>📦 Amazon (France / USA / Japon)</li>
              <li>🛍️ TEMU</li>
              <li>⚡ AliExpress</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Taux & Transparence</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>💶 1 EUR = 4.00 DT</li>
              <li>💵 1 USD = 4.00 DT</li>
              <li>💴 100 JPY = 2.65 DT</li>
              <li>🚚 Livraison dans les 24 gouvernorats</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#1f143d] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} AYROVI. Tous droits réservés — Tunisie 🇹🇳.</p>
          <p className="flex items-center gap-1">
            Conçu avec <Heart className="w-3 h-3 text-[#7e57ff] fill-[#7e57ff]" /> pour faciliter vos achats en Tunisie.
          </p>
        </div>

      </div>
    </footer>
  );
};
