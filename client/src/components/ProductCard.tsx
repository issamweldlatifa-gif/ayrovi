import React, { useState, useEffect } from 'react';
import { ShoppingBag, Check, Calculator, RefreshCw } from 'lucide-react';
import { ScrapedProduct, StoreType } from '../types';

interface ProductCardProps {
  product: ScrapedProduct;
  onAddToCart: (item: {
    store: string;
    externalId?: string | null;
    url: string;
    title: string;
    imageUrl: string;
    sourcePrice: number;
    sourceCurrency: string;
    priceTND: number;
    variant?: string;
    quantity: number;
  }) => void;
  onReset: () => void;
}

const RATES_TO_TND: Record<string, number> = {
  EUR: 4.00,
  USD: 4.00,
  JPY: 0.0265,
  GBP: 4.80,
  CAD: 2.95,
  CHF: 4.20,
  TND: 1.0,
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onReset }) => {
  const [title, setTitle] = useState(product.title);
  const [sourcePrice, setSourcePrice] = useState<number>(product.sourcePrice || 0);
  const [currency, setCurrency] = useState<string>(product.sourceCurrency || 'EUR');
  const [variantNote, setVariantNote] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);

  const rate = RATES_TO_TND[currency] || 4.00;
  const convertedTND = Math.round(sourcePrice * rate * 100) / 100;
  const serviceFeeTND = sourcePrice > 0 ? Math.round(Math.max(10, convertedTND * 0.08) * 100) / 100 : 0;
  const shippingTND = sourcePrice > 0 ? 25.00 : 0;
  const totalTND = sourcePrice > 0 ? Math.round((convertedTND + serviceFeeTND + shippingTND) * 100) / 100 : 0;

  useEffect(() => {
    setTitle(product.title);
    setSourcePrice(product.sourcePrice || 0);
    setCurrency(product.sourceCurrency || 'EUR');
  }, [product]);

  const handleAdd = () => {
    if (sourcePrice <= 0) {
      alert("Veuillez indiquer le prix de l'article avant de l'ajouter au panier.");
      return;
    }

    onAddToCart({
      store: product.store,
      externalId: product.externalId,
      url: product.url,
      title: title.trim(),
      imageUrl: product.mainImage || '',
      sourcePrice: Number(sourcePrice),
      sourceCurrency: currency,
      priceTND: totalTND,
      variant: variantNote.trim() || undefined,
      quantity,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const getStoreBadge = (store: StoreType) => {
    switch (store) {
      case 'shein':
        return { label: 'SHEIN 👗', color: 'bg-pink-500/15 text-pink-300 border-pink-500/30' };
      case 'amazon':
        return { label: 'Amazon 📦', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'temu':
        return { label: 'TEMU 🛍️', color: 'bg-orange-500/15 text-orange-300 border-orange-500/30' };
      case 'aliexpress':
        return { label: 'AliExpress ⚡', color: 'bg-red-500/15 text-red-300 border-red-500/30' };
      default:
        return { label: 'Boutique Internationale 🌐', color: 'bg-[#673de6]/20 text-[#a384ff] border-[#673de6]/30' };
    }
  };

  const badge = getStoreBadge(product.store);

  return (
    <div className="w-full glass-panel-glow rounded-3xl overflow-hidden shadow-2xl transition-all">
      
      {/* Top Banner Header */}
      <div className="bg-[#170e33]/90 border-b border-[#332266] px-5 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
            {badge.label}
          </span>
          <span className="text-xs text-slate-400 font-medium hidden xs:inline">
            Article identifié
          </span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Nouvel article</span>
        </button>
      </div>

      <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Product Image Section */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[280px] rounded-2xl overflow-hidden bg-[#0c081a] border border-[#332266] flex items-center justify-center p-2 group">
            {product.mainImage ? (
              <img
                src={product.mainImage}
                alt={title}
                className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-xl bg-[#673de6]/20 border border-[#673de6]/30 flex items-center justify-center mx-auto mb-2 text-[#a384ff]">
                  📦
                </div>
                <p className="text-xs text-slate-400 font-semibold">Aperçu du produit</p>
              </div>
            )}
          </div>
          {product.externalId && (
            <span className="text-[11px] text-slate-500 font-mono mt-2.5">
              Réf : {product.externalId}
            </span>
          )}
        </div>

        {/* Product Details & Calculations */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Title Editor */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Titre de l'article (modifiable) :
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0c081a]/80 border border-[#332266] focus:border-[#7e57ff] rounded-xl px-3.5 py-2.5 text-sm sm:text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#673de6]/30 transition-all"
            />
          </div>

          {/* Price & Currency Controls */}
          <div className="bg-[#0c081a]/70 border border-[#332266] rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#a384ff]" />
                <span>Prix original sur le site source :</span>
              </span>
              <span className="text-[11px] text-[#a384ff] font-semibold">
                (1 EUR/USD = 4.00 DT)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  Montant en devise :
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={sourcePrice || ''}
                    onChange={(e) => setSourcePrice(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full bg-[#170e33] border border-[#332266] focus:border-[#7e57ff] rounded-xl px-3.5 py-2.5 text-base font-black text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  Devise :
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-[#170e33] border border-[#332266] focus:border-[#7e57ff] rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none"
                >
                  <option value="EUR">Euro (€ EUR) — 4.00 DT</option>
                  <option value="USD">Dollar ($ USD) — 4.00 DT</option>
                  <option value="JPY">Yen Japonais (¥ JPY) — 2.65 DT / 100 JPY</option>
                  <option value="GBP">Livre Sterling (£ GBP) — 4.80 DT</option>
                </select>
              </div>
            </div>

            {/* Cost Breakdown Details */}
            <div className="pt-3 border-t border-[#332266]/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Prix de l'article converti :</span>
                <span className="font-semibold text-slate-200">{convertedTND.toFixed(2)} DT</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Dédouanement et expédition express internationale :</span>
                <span className="font-semibold text-slate-200">+{shippingTND.toFixed(2)} DT</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Commission de service et garantie AYROVI (8% ou min 10 DT) :</span>
                <span className="font-semibold text-slate-200">+{serviceFeeTND.toFixed(2)} DT</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#332266] text-sm sm:text-base font-black">
                <span className="text-white">Total estimé à la livraison (DT) :</span>
                <span className="text-[#a384ff] text-lg sm:text-xl">{totalTND.toFixed(2)} DT</span>
              </div>
            </div>
          </div>

          {/* Size & Color / Variant Custom Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Taille / Couleur / Précisions :
              </label>
              <input
                type="text"
                value={variantNote}
                onChange={(e) => setVariantNote(e.target.value)}
                placeholder="Ex : Taille M, Couleur Noir..."
                className="w-full bg-[#0c081a]/80 border border-[#332266] focus:border-[#7e57ff] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Quantité :
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl bg-[#170e33] hover:bg-[#24164f] active:scale-95 text-white font-black text-lg flex items-center justify-center border border-[#332266] transition-all"
                >
                  -
                </button>
                <span className="text-base font-bold text-white min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl bg-[#170e33] hover:bg-[#24164f] active:scale-95 text-white font-black text-lg flex items-center justify-center border border-[#332266] transition-all"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Add To Cart CTA Button */}
          <button
            onClick={handleAdd}
            disabled={sourcePrice <= 0}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition-all duration-200 ${
              isAdded
                ? 'bg-emerald-600 text-white scale-[0.99]'
                : 'hostinger-btn text-white shadow-[#673de6]/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5" />
                <span>Article ajouté au panier !</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>Ajouter au panier ({totalTND.toFixed(2)} DT)</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
