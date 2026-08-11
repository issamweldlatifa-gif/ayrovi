import React from 'react';
import { ArrowRightLeft, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import aboutParallaxImage from '../assets/about-parallax.jpg';

const BENEFITS = [
  {
    step: '01',
    title: 'Taux Fixe & Garanti',
    description:
      '1 Euro = 4.00 DT et 1 Dollar = 4.00 DT. Vous connaissez le montant exact en Dinars dès la validation de votre panier.',
    icon: ArrowRightLeft,
    iconClassName: 'bg-[#ffc24b] text-[#1d2130]',
    accentClassName: 'from-[#ffc24b] to-[#ff9f43]',
  },
  {
    step: '02',
    title: 'Dédouanement Inclus',
    description:
      "Toutes les démarches administratives, taxes d’importation et dédouanement sont entièrement prises en charge.",
    icon: ShieldCheck,
    iconClassName: 'bg-[#673de6] text-white',
    accentClassName: 'from-[#673de6] to-[#9b7cf7]',
  },
  {
    step: '03',
    title: 'Livraison 24 Gouvernorats',
    description:
      "Expédition sécurisée jusqu’à votre domicile partout en Tunisie avec option de paiement en espèces à la livraison.",
    icon: Truck,
    iconClassName: 'bg-emerald-500 text-white',
    accentClassName: 'from-emerald-500 to-[#43b1de]',
  },
];

export const AboutSection: React.FC = () => {
  return (
    <section
      className="relative isolate overflow-clip bg-[#edf9ff]"
      aria-labelledby="why-ayrovi-title"
    >
      {/* A pinned, doubled image keeps the full section covered while every block scrolls over it. */}
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
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#081426]/35 sm:bg-gradient-to-r sm:from-transparent sm:via-white/15 sm:to-[#f8fcff]/95" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/75 to-transparent" />
      </div>

      <div className="relative z-10 -mt-[100svh] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Intro occupies its own parallax screen. */}
        <header className="flex min-h-[92svh] items-end justify-center pb-20 pt-28 sm:justify-end sm:pb-24">
          <div className="w-full rounded-[30px] border border-white/80 bg-white/90 px-6 py-8 text-center shadow-[0_32px_90px_-30px_rgba(23,83,119,0.42)] backdrop-blur-xl sm:max-w-[620px] sm:rounded-[38px] sm:px-10 sm:py-10 lg:px-12">
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
        </header>

        {/* Each advantage gets an independent screen with intentional breathing room. */}
        {BENEFITS.map(({ step, title, description, icon: Icon, iconClassName, accentClassName }, index) => (
          <React.Fragment key={title}>
            <article className="flex min-h-[92svh] items-center justify-center py-16 sm:justify-end sm:py-20">
              <div className="relative w-full overflow-hidden rounded-[30px] border border-white/85 bg-white/90 p-7 shadow-[0_30px_80px_-28px_rgba(12,65,94,0.45)] backdrop-blur-xl sm:max-w-[560px] sm:rounded-[36px] sm:p-10">
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accentClassName}`} />

                <div className="flex items-start justify-between gap-5">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-md sm:h-14 sm:w-14 ${iconClassName}`}>
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </span>
                  <span className="text-5xl font-black leading-none text-[#1d2130]/[0.07] sm:text-6xl">
                    {step}
                  </span>
                </div>

                <div className="my-7 h-px w-full bg-gradient-to-r from-[#43b1de]/70 via-[#dfeaf0] to-transparent" />

                <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#397a9b]">
                  Avantage AYROVI
                </p>
                <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1d2130] sm:text-3xl">
                  {title}
                </h3>
                <p className="mt-4 text-sm font-medium leading-7 text-[#697180] sm:text-base sm:leading-8">
                  {description}
                </p>
              </div>
            </article>

            {index < BENEFITS.length - 1 && (
              <div className="flex h-[24svh] items-center justify-center sm:h-[30svh]" aria-hidden="true">
                <div className="flex h-full flex-col items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_0_6px_rgba(67,177,222,0.2)]" />
                  <span className="w-px flex-1 bg-gradient-to-b from-white/90 via-[#43b1de]/75 to-white/90" />
                  <span className="h-2 w-2 rounded-full bg-[#43b1de] shadow-[0_0_0_6px_rgba(255,255,255,0.32)]" />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

        <div className="flex min-h-[35svh] items-start justify-center pt-8 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white drop-shadow-md sm:justify-end sm:text-xs">
          <div className="flex w-full items-center justify-center gap-3 sm:max-w-[560px]">
            <span className="h-px w-10 bg-white/80" />
            Simple · Transparent · Local
            <span className="h-px w-10 bg-white/80" />
          </div>
        </div>
      </div>
    </section>
  );
};
