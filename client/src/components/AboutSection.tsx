import React from 'react';
import { ArrowRightLeft, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import aboutParallaxImage from '../assets/about-parallax.jpg';

const BENEFITS = [
  {
    title: 'Taux Fixe & Garanti',
    description:
      '1 Euro = 4.00 DT et 1 Dollar = 4.00 DT. Vous connaissez le montant exact en Dinars dès la validation de votre panier.',
    icon: ArrowRightLeft,
    iconClassName: 'bg-[#ffc24b] text-[#1d2130]',
  },
  {
    title: 'Dédouanement Inclus',
    description:
      "Toutes les démarches administratives, taxes d’importation et dédouanement sont entièrement prises en charge.",
    icon: ShieldCheck,
    iconClassName: 'bg-[#673de6] text-white',
  },
  {
    title: 'Livraison 24 Gouvernorats',
    description:
      "Expédition sécurisée jusqu’à votre domicile partout en Tunisie avec option de paiement en espèces à la livraison.",
    icon: Truck,
    iconClassName: 'bg-emerald-500 text-white',
  },
];

export const AboutSection: React.FC = () => {
  return (
    <section
      className="relative isolate overflow-clip bg-[#edf9ff]"
      aria-labelledby="why-ayrovi-title"
    >
      {/* The image remains pinned while the content passes over it, creating the parallax effect. */}
      <div className="sticky top-0 h-[100svh] overflow-hidden" aria-hidden="true">
        <img
          src={aboutParallaxImage}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-2xl"
        />
        <div className="absolute inset-0 bg-white/25" />
        <img
          src={aboutParallaxImage}
          alt=""
          className="absolute inset-0 h-full w-full object-contain object-center sm:object-left"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-[#081426]/30 sm:bg-gradient-to-r sm:from-transparent sm:via-white/20 sm:to-[#f8fcff]/95" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/70 to-transparent" />
      </div>

      <div className="relative z-10 -mt-[100svh] mx-auto flex min-h-[165svh] max-w-7xl items-center px-4 py-20 sm:min-h-[150svh] sm:px-6 sm:py-28 lg:px-8">
        <div className="w-full sm:ml-auto sm:max-w-[620px]">
          <div className="overflow-hidden rounded-[30px] border border-white/80 bg-white/90 shadow-[0_32px_90px_-30px_rgba(23,83,119,0.42)] backdrop-blur-xl sm:rounded-[38px]">
            <div className="px-6 pb-7 pt-8 text-center sm:px-10 sm:pb-9 sm:pt-10 lg:px-12">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#673de6]/20 bg-[#673de6]/10 px-3.5 py-1 text-[11px] font-bold text-[#673de6] shadow-sm sm:text-xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Pourquoi choisir AYROVI ?</span>
              </div>

              <h2
                id="why-ayrovi-title"
                className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-[#1d2130] sm:text-4xl"
              >
                La simplicité d’un achat local pour vos marques mondiales
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-sm font-medium leading-7 text-[#697180] sm:text-base">
                Plus besoin de carte bancaire internationale ni de formalités douanières complexes.
                AYROVI s’occupe de l’importation de A à Z.
              </p>
            </div>

            <ul className="border-y border-[#dfeaf0] bg-white/55 px-6 sm:px-10 lg:px-12">
              {BENEFITS.map(({ title, description, icon: Icon, iconClassName }) => (
                <li
                  key={title}
                  className="grid grid-cols-[auto_1fr] gap-4 border-b border-[#dfeaf0] py-6 last:border-b-0 sm:gap-5 sm:py-7"
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm sm:h-12 sm:w-12 ${iconClassName}`}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  <span className="min-w-0">
                    <h3 className="text-base font-bold text-[#1d2130] sm:text-lg">{title}</h3>
                    <p className="mt-2 text-xs font-medium leading-6 text-[#697180] sm:text-sm sm:leading-7">
                      {description}
                    </p>
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-center gap-3 px-6 py-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#397a9b] sm:text-xs">
              <span className="h-px w-10 bg-[#43b1de]" />
              Simple · Transparent · Local
              <span className="h-px w-10 bg-[#43b1de]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
