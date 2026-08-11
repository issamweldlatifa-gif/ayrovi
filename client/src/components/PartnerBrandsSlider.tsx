import React from 'react';

interface BrandItem {
  name: string;
  category: string;
  grad: string;
  accent: string;
}

const BRANDS: BrandItem[] = [
  { name: "SHEIN", category: "Mode & Tendances", grad: "linear-gradient(135deg, #1e1035, #3d1d6d)", accent: "👗" },
  { name: "Amazon", category: "High-Tech & Maison", grad: "linear-gradient(135deg, #1f2d3d, #0f1c24)", accent: "📦" },
  { name: "AliExpress", category: "Milliers d'offres", grad: "linear-gradient(135deg, #3d1414, #1f0a0a)", accent: "⚡" },
  { name: "Zara", category: "Mode Internationale", grad: "linear-gradient(135deg, #1c1c1c, #0d0d0d)", accent: "✨" },
  { name: "TEMU", category: "Prix d'usine", grad: "linear-gradient(135deg, #3d1e0f, #211005)", accent: "🛍️" },
  { name: "Zalando", category: "Chaussures & Vêtements", grad: "linear-gradient(135deg, #2b153d, #140920)", accent: "👟" },
  { name: "ASOS", category: "Streetwear & Accessoires", grad: "linear-gradient(135deg, #0d1e33, #050d17)", accent: "🕶️" },
  { name: "Nike", category: "Sport & Sneakers", grad: "linear-gradient(135deg, #151515, #292929)", accent: "🔥" },
  { name: "H&M", category: "Collection Globale", grad: "linear-gradient(135deg, #290d0d, #140505)", accent: "🧣" },
  { name: "eBay", category: "Boutiques Rares", grad: "linear-gradient(135deg, #1c1438, #0e0921)", accent: "💎" },
];

export const PartnerBrandsSlider: React.FC = () => {
  const allBrands = [...BRANDS, ...BRANDS];

  return (
    <section className="relative w-full py-20 sm:py-28 bg-[#0a0518] text-white overflow-hidden my-16 sm:my-24">
      
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#673de6]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Container */}
      <div className="relative text-center px-4 max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-3 text-xs sm:text-sm font-semibold tracking-widest text-[#ffc24b] uppercase">
          <span className="w-6 h-[1.5px] bg-[#ffc24b]" />
          <span>Marketplaces Supportées</span>
          <span className="w-6 h-[1.5px] bg-[#ffc24b]" />
        </div>

        {/* Title */}
        <h2 className="font-extrabold text-2xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
          Boutiques & Enseignes Internationales
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-medium opacity-90">
          AYROVI connecte vos achats aux plus grands sites e-commerce internationaux, avec dédouanement et livraison à domicile en Dinars Tunisiens.
        </p>

      </div>

      {/* Marquee Slider Row */}
      <div className="relative overflow-hidden w-full">
        <div className="marquee-track px-4">
          {allBrands.map((brand, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[240px] sm:w-[320px] h-[300px] sm:h-[380px] rounded-2xl relative overflow-hidden flex flex-col justify-end p-5 transition-all duration-300 hover:-translate-y-2 border border-white/10 group shadow-xl"
              style={{ background: brand.grad }}
            >
              {/* Top Accent Icon */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl shadow-xs">
                {brand.accent}
              </div>

              {/* Glass Card Info */}
              <div className="relative z-10 p-4 sm:p-5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 group-hover:border-white/40 transition-all">
                <span className="block text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-[#ffc24b] mb-1">
                  {brand.category}
                </span>
                <h3 className="font-extrabold text-2xl sm:text-3xl text-white leading-none">
                  {brand.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
