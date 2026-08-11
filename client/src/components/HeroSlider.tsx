import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface SlideData {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  bgColor: string;
  accentColor: string;
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    badge: 'Offre Spéciale 2026',
    title: 'Achetez sur SHEIN & Amazon directement en Dinars',
    subtitle: 'Importez n\'importe quel article par capture d\'écran ou lien. Dédouanement et livraison à domicile garantis.',
    ctaText: 'Commander maintenant',
    bgColor: 'from-[#fef08a] to-[#fde047]', // Warm Yellow shade 1
    accentColor: '#854d0e',
  },
  {
    id: 2,
    badge: 'Taux Fixe Garanti',
    title: '1 Euro = 4.00 DT & 1 Dollar = 4.00 DT',
    subtitle: 'Zéro frais cachés. Visualisez le coût exact en Dinars Tunisiens avant de passer votre commande.',
    ctaText: 'Calculer mon panier',
    bgColor: 'from-[#fef9c3] to-[#fef08a]', // Warm Yellow shade 2
    accentColor: '#713f12',
  },
  {
    id: 3,
    badge: 'Livraison Rapide',
    title: 'Expédition express dans les 24 Gouvernorats',
    subtitle: 'Paiement sécurisé à la livraison ou par D17 / Flouci. Suivi de colis en temps réel sur WhatsApp.',
    ctaText: 'Découvrir le service',
    bgColor: 'from-[#fef08a] to-[#facc15]', // Warm Yellow shade 3
    accentColor: '#78350f',
  },
];

interface HeroSliderProps {
  onCtaClick: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onCtaClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[currentSlide];

  return (
    <section 
      className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slider Card */}
      <div className={`relative w-full rounded-3xl overflow-hidden shadow-lg border border-yellow-200/80 bg-gradient-to-r ${slide.bgColor} transition-all duration-700 min-h-[260px] sm:min-h-[300px] flex items-center p-6 sm:p-12`}>
        
        {/* Decorative Graphic Shapes */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-white/30 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

        {/* Slide Content */}
        <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 shadow-xs border border-yellow-300 text-xs sm:text-sm font-bold text-[#673de6]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{slide.badge}</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1d2130] tracking-tight leading-tight">
            {slide.title}
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-base font-medium text-[#451a03] leading-relaxed max-w-xl">
            {slide.subtitle}
          </p>

          {/* CTA Button in Hostinger Purple */}
          <div className="pt-2">
            <button
              onClick={onCtaClick}
              className="hostinger-btn px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#1d2130] flex items-center justify-center shadow-md transition-all hover:scale-105 z-20"
          aria-label="Slide précédent"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#1d2130] flex items-center justify-center shadow-md transition-all hover:scale-105 z-20"
          aria-label="Slide suivant"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-white/60 backdrop-blur-xs px-3 py-1.5 rounded-full">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'w-6 bg-[#673de6]'
                  : 'w-2 bg-[#d97706]/50 hover:bg-[#d97706]'
              }`}
              aria-label={`Aller au slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
