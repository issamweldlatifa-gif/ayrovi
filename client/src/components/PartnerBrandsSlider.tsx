import React from 'react';

interface BrandItem {
  name: string;
  category: string;
  grad: string;
  accent: string;
}

const BRANDS: BrandItem[] = [
  { name: 'SHEIN', category: 'Mode & Tendances', grad: 'linear-gradient(145deg, #2d174f 0%, #13091f 100%)', accent: '👗' },
  { name: 'Amazon', category: 'High-Tech & Maison', grad: 'linear-gradient(145deg, #23384d 0%, #0a121a 100%)', accent: '📦' },
  { name: 'AliExpress', category: "Des milliers d'offres", grad: 'linear-gradient(145deg, #551e1e 0%, #180707 100%)', accent: '⚡' },
  { name: 'Zara', category: 'Mode Internationale', grad: 'linear-gradient(145deg, #353535 0%, #090909 100%)', accent: '✨' },
  { name: 'TEMU', category: "Prix d'usine", grad: 'linear-gradient(145deg, #5b2c12 0%, #1d0c03 100%)', accent: '🛍️' },
  { name: 'Zalando', category: 'Chaussures & Vêtements', grad: 'linear-gradient(145deg, #44215f 0%, #15091e 100%)', accent: '👟' },
  { name: 'ASOS', category: 'Streetwear & Accessoires', grad: 'linear-gradient(145deg, #16365d 0%, #050b13 100%)', accent: '🕶️' },
  { name: 'Nike', category: 'Sport & Sneakers', grad: 'linear-gradient(145deg, #333333 0%, #0c0c0c 100%)', accent: '🔥' },
  { name: 'H&M', category: 'Collection Globale', grad: 'linear-gradient(145deg, #541919 0%, #150505 100%)', accent: '🧣' },
  { name: 'eBay', category: 'Boutiques Rares', grad: 'linear-gradient(145deg, #332663 0%, #0e0921 100%)', accent: '💎' },
];

export const PartnerBrandsSlider: React.FC = () => {
  const allBrands = [...BRANDS, ...BRANDS];

  return (
    <section className="w-full bg-white py-16 sm:py-24">
      {/* Description outside the dark slider container */}
      <div className="mx-auto max-w-4xl px-5 pb-10 text-center sm:px-8 sm:pb-14">
        <div className="mb-4 inline-flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#673de6] sm:text-sm">
          <span className="h-[2px] w-7 bg-[#facc15]" />
          Marketplaces supportées
          <span className="h-[2px] w-7 bg-[#facc15]" />
        </div>
        <h2 className="text-3xl font-black leading-tight tracking-[-0.045em] text-[#17131f] sm:text-5xl">
          Vos marques préférées, réunies au même endroit.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-600 sm:text-base">
          AYROVI connecte vos achats aux plus grandes boutiques internationales et s’occupe du paiement, du dédouanement et de la livraison en Dinars Tunisiens.
        </p>
      </div>

      {/* Large black brands slider */}
      <div className="relative mx-auto max-w-[1440px] overflow-hidden bg-black py-10 shadow-[0_30px_80px_-35px_rgba(0,0,0,0.65)] sm:rounded-[38px] sm:py-14">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[70%] -translate-x-1/2 rounded-full bg-[#673de6]/20 blur-[100px]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-black to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-black to-transparent sm:w-28" />

        <div className="relative mb-8 flex items-center justify-between px-6 sm:px-12">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/55">Explorez les boutiques</p>
          <span className="rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-bold text-white/65">Défilement automatique</span>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="brands-marquee-track px-5 sm:px-8">
            {allBrands.map((brand, index) => (
              <article
                key={`${brand.name}-${index}`}
                className="group relative h-[360px] w-[285px] flex-shrink-0 overflow-hidden rounded-[28px] border border-white/15 p-6 shadow-2xl transition duration-500 hover:-translate-y-2 hover:border-white/35 sm:h-[455px] sm:w-[375px] sm:rounded-[32px] sm:p-8 lg:h-[480px] lg:w-[410px]"
                style={{ background: brand.grad }}
              >
                <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl transition duration-700 group-hover:scale-125" />
                <span className="absolute left-6 top-5 text-[11px] font-bold tabular-nums tracking-[0.22em] text-white/45 sm:left-8 sm:top-7">
                  {String((index % BRANDS.length) + 1).padStart(2, '0')}
                </span>
                <div className="absolute right-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl shadow-lg backdrop-blur-md sm:right-7 sm:top-7 sm:h-16 sm:w-16 sm:text-3xl">
                  {brand.accent}
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="select-none text-7xl font-black tracking-[-0.08em] text-white/[0.055] sm:text-8xl">
                    {brand.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>

                <div className="absolute inset-x-6 bottom-6 z-10 rounded-[22px] border border-white/20 bg-black/25 p-5 backdrop-blur-xl transition duration-300 group-hover:bg-black/35 sm:inset-x-8 sm:bottom-8 sm:p-6">
                  <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#facc15] sm:text-xs">
                    {brand.category}
                  </span>
                  <h3 className="text-3xl font-black leading-none tracking-[-0.04em] text-white sm:text-4xl">
                    {brand.name}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
