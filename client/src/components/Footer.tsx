import React from 'react';
import { Heart } from 'lucide-react';
import ratesTransparencyImage from '../assets/rates-transparency.jpg';

const EXCHANGE_RATES = [
  '1 EUR = 4.00 DT',
  '1 USD = 4.00 DT',
  '100 JPY = 2.65 DT',
  'Livraison dans les 24 gouvernorats',
];

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[#e2e8f0] bg-white pb-8 pt-12 text-[#6b7280]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 grid grid-cols-1 gap-8 text-xs md:grid-cols-3">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#673de6] text-base font-black text-white shadow-xs">
                A
              </div>
              <span className="text-lg font-bold text-[#1d2130]">AYROVI</span>
            </div>
            <p className="max-w-sm leading-relaxed text-[#6b7280]">
              La plateforme unifiée pour vos achats internationaux en Dinars Tunisiens. Commandez facilement depuis SHEIN, Amazon, TEMU et AliExpress en toute transparence et sans carte bancaire internationale.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#1d2130]">Boutiques Partenaires</h4>
            <ul className="space-y-1.5 text-[#6b7280]">
              <li>👗 SHEIN International</li>
              <li>📦 Amazon (France / USA / Japon)</li>
              <li>🛍️ TEMU</li>
              <li>⚡ AliExpress</li>
            </ul>
          </div>
        </div>

        {/* Exchange rates are presented as glass text over the supplied rectangular image. */}
        <section
          className="relative mb-10 min-h-[410px] overflow-hidden rounded-[28px] border border-[#d8e8ef] shadow-[0_24px_70px_-30px_rgba(20,82,112,0.45)] sm:min-h-[360px] sm:rounded-[34px]"
          aria-labelledby="rates-title"
        >
          <img
            src={ratesTransparencyImage}
            alt="Symboles du dollar, de l’euro et du yen illustrant les taux de change AYROVI"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071525]/70 via-[#071525]/30 to-transparent" />

          <div className="relative z-10 flex min-h-[410px] items-center p-4 sm:min-h-[360px] sm:p-8 lg:p-10">
            <div className="w-full rounded-[24px] border border-white/30 bg-[#08192a]/45 p-6 text-white shadow-2xl backdrop-blur-xl sm:max-w-[470px] sm:rounded-[28px] sm:p-8">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#aee8ff] sm:text-xs">
                AYROVI · Tunisie
              </p>
              <h4 id="rates-title" className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Taux &amp; Transparence
              </h4>

              <ul className="mt-6 divide-y divide-white/20 border-y border-white/20">
                {EXCHANGE_RATES.map((rate) => (
                  <li key={rate} className="py-3 text-sm font-semibold tracking-wide text-white/95 sm:text-base">
                    {rate}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#f1f3f9] pt-6 text-center text-[11px] text-[#9ca3af] sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} AYROVI. Tous droits réservés — Tunisie 🇹🇳.</p>
          <p className="flex items-center gap-1">
            Conçu avec <Heart className="h-3 w-3 fill-[#673de6] text-[#673de6]" /> pour faciliter vos achats en Tunisie.
          </p>
        </div>
      </div>
    </footer>
  );
};
