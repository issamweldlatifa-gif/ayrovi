import React from 'react';
import heroHomme from '../assets/hero-homme.jpg';
import heroFemme from '../assets/hero-femme.jpg';
import heroEnfants from '../assets/hero-enfants.jpg';

const HERO_IMAGES = [
  { src: heroHomme, alt: 'Mode homme AYROVI', position: 'object-center' },
  { src: heroFemme, alt: 'Mode femme AYROVI', position: 'object-center' },
  { src: heroEnfants, alt: 'Mode enfants AYROVI', position: 'object-center' },
];

export const HeroSlider: React.FC = () => {
  return (
    <section id="home-hero" className="-mt-16 w-full sm:-mt-20">
      <div className="relative h-[72svh] min-h-[520px] w-full overflow-hidden bg-[#24104f] shadow-[0_28px_70px_-32px_rgba(43,18,89,0.7)] sm:min-h-[620px] lg:min-h-[680px] lg:max-h-[860px]">
        <div className="absolute inset-0 grid grid-cols-[0.9fr_0.9fr_1.25fr]">
          {HERO_IMAGES.map((image) => (
            <div key={image.alt} className="relative min-w-0 overflow-hidden">
              <img src={image.src} alt={image.alt} className={`h-full w-full object-cover ${image.position}`} />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/35" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(36,16,79,0.22),transparent_30%,transparent_70%,rgba(36,16,79,0.16))]" />

        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center px-5 pb-9 text-center sm:px-10 sm:pb-12">
          <h1 className="max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.055em] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)] sm:text-6xl lg:text-7xl">
            Toute la mode du monde, livrée chez vous.
          </h1>
        </div>
      </div>
    </section>
  );
};
