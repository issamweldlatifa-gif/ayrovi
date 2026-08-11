import React from 'react';
import { ShieldCheck, Truck, ArrowRightLeft, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-14 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#673de6]/10 border border-[#673de6]/20 text-[#673de6] text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pourquoi choisir AYROVI ?</span>
        </div>
        <h2 className="font-extrabold text-2xl sm:text-4xl md:text-5xl text-[#1d2130] tracking-tight leading-tight">
          La simplicité d'un achat local pour vos marques mondiales
        </h2>
        <p className="text-xs sm:text-base text-[#6b7280] leading-relaxed font-medium">
          Plus besoin de carte bancaire internationale ni de formalités douanières complexes. AYROVI s'occupe de l'importation de A à Z.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Pillar 1 */}
        <div className="bg-[#f8f9fe] border border-[#eef0f6] rounded-3xl p-6 sm:p-8 space-y-3 hover:border-[#673de6]/40 hover:shadow-lg transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#ffc24b] text-[#1d2130] flex items-center justify-center font-black text-xl shadow-xs">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#1d2130]">Taux Fixe & Garanti</h3>
          <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed font-medium">
            1 Euro = 4.00 DT et 1 Dollar = 4.00 DT. Vous connaissez le montant exact en Dinars dès la validation de votre panier.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-[#f8f9fe] border border-[#eef0f6] rounded-3xl p-6 sm:p-8 space-y-3 hover:border-[#673de6]/40 hover:shadow-lg transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#673de6] text-white flex items-center justify-center font-black text-xl shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#1d2130]">Dédouanement Inclus</h3>
          <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed font-medium">
            Toutes les démarches administratives, taxes d'importation et dédouanement sont entièrement prises en charge.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-[#f8f9fe] border border-[#eef0f6] rounded-3xl p-6 sm:p-8 space-y-3 hover:border-[#673de6]/40 hover:shadow-lg transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-xs">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#1d2130]">Livraison 24 Gouvernorats</h3>
          <p className="text-xs sm:text-sm text-[#6b7280] leading-relaxed font-medium">
            Expédition sécurisée jusqu'à votre domicile partout en Tunisie avec option de paiement en espèces à la livraison.
          </p>
        </div>

      </div>

    </section>
  );
};
