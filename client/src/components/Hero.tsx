import React from 'react';
import { ShieldCheck, Truck, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-6 pb-4 sm:py-8 text-center max-w-4xl mx-auto px-4">
      {/* Decorative Hostinger Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#673de6]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Banner Tag */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#673de6]/15 border border-[#673de6]/30 text-[#a384ff] text-xs sm:text-sm font-bold mb-4 shadow-sm">
        <span>Taux de conversion clair et garanti</span>
      </div>

      {/* Main Title */}
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight sm:leading-snug mb-3">
        Commandez depuis vos boutiques préférées en <span className="text-[#a384ff]">Dinars Tunisiens</span>
      </h1>

      {/* Subtitle */}
      <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
        Importez vos articles depuis <strong className="text-white">SHEIN</strong>, <strong className="text-white">Amazon</strong>, <strong className="text-white">TEMU</strong> ou <strong className="text-white">AliExpress</strong> par capture d'écran ou lien direct. Nous prenons en charge l'achat, le dédouanement et la livraison à domicile partout en Tunisie.
      </p>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xl mx-auto text-slate-300 text-[11px] sm:text-xs font-semibold">
        <div className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#170e33]/80 border border-[#332266]">
          <Zap className="w-3.5 h-3.5 text-[#a384ff]" />
          <span>Calcul instantané</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#170e33]/80 border border-[#332266]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tarifs 100% transparents</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#170e33]/80 border border-[#332266]">
          <Truck className="w-3.5 h-3.5 text-blue-400" />
          <span>Livraison 24 Gouvernorats</span>
        </div>
      </div>
    </section>
  );
};
