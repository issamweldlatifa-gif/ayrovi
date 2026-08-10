import React, { useState, useEffect } from 'react';
import { ShoppingBag, Check, Calculator, ShieldCheck, Truck, RefreshCw, AlertCircle } from 'lucide-react';
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

  // Recalculate TND pricing in real-time
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
      alert('يرجى تحديد سعر المنتج أولاً.');
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
        return { label: 'SHEIN 👗', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' };
      case 'amazon':
        return { label: 'Amazon 📦', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'temu':
        return { label: 'TEMU 🛍️', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' };
      case 'aliexpress':
        return { label: 'AliExpress ⚡', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
      default:
        return { label: 'متجر دولي 🌐', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    }
  };

  const badge = getStoreBadge(product.store);

  return (
    <div className="w-full glass-panel-glow rounded-3xl overflow-hidden shadow-2xl transition-all">
      
      {/* Top Banner Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-5 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
            {badge.label}
          </span>
          <span className="text-xs text-slate-400 font-medium hidden xs:inline">
            تم التحقق من المنتج
          </span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>منتج جديد</span>
        </button>
      </div>

      <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Product Image Section */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[280px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-2 group">
            {product.mainImage ? (
              <img
                src={product.mainImage}
                alt={title}
                className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-2 text-brand-400">
                  📦
                </div>
                <p className="text-xs text-slate-400 font-semibold">صورة المنتج المستخرج</p>
              </div>
            )}
          </div>
          {product.externalId && (
            <span className="text-[11px] text-slate-500 font-mono mt-2.5">
              رقم المرجع: {product.externalId}
            </span>
          )}
        </div>

        {/* Product Details & Calculations */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Title Editor */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              اسم المنتج المستخرج (يمكنك التعديل):
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-700/80 focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-sm sm:text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>

          {/* Price & Currency Controls */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-brand-400" />
                <span>السعر الأصلي غير المخفض بالموقع:</span>
              </span>
              <span className="text-[11px] text-brand-400 font-semibold">
                (1 EUR/USD = 4.00 DT)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  السعر بالعملة الأجنبية:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={sourcePrice || ''}
                    onChange={(e) => setSourcePrice(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-base font-black text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  العملة:
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none"
                >
                  <option value="EUR">يورو (€ EUR) — 4.00 د.ت</option>
                  <option value="USD">دولار ($ USD) — 4.00 د.ت</option>
                  <option value="JPY">ين ياباني (¥ JPY) — 2.65 د.ت لكل 100 ين</option>
                  <option value="GBP">جنيه إسترليني (£ GBP) — 4.80 د.ت</option>
                </select>
              </div>
            </div>

            {/* Cost Breakdown Details */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>سعر المنتج المحول:</span>
                <span className="font-semibold text-slate-200">{convertedTND.toFixed(2)} د.ت</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>الجمارك والشحن الدولي السريع:</span>
                <span className="font-semibold text-slate-200">+{shippingTND.toFixed(2)} د.ت</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>عمولة الخدمة والضمان (8% أو min 10 DT):</span>
                <span className="font-semibold text-slate-200">+{serviceFeeTND.toFixed(2)} د.ت</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm sm:text-base font-black">
                <span className="text-white">الإجمالي النهائي بالدينار التونسي (DT):</span>
                <span className="text-brand-400 text-lg sm:text-xl">{totalTND.toFixed(2)} د.ت</span>
              </div>
            </div>
          </div>

          {/* Size & Color / Variant Custom Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                المقاس / اللون / ملاحظات خاصة:
              </label>
              <input
                type="text"
                value={variantNote}
                onChange={(e) => setVariantNote(e.target.value)}
                placeholder="مثال: مقاس M، لون أسود..."
                className="w-full bg-slate-950/70 border border-slate-700/80 focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الكمية المطلوبة:
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-black text-lg flex items-center justify-center transition-all"
                >
                  -
                </button>
                <span className="text-base font-bold text-white min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-black text-lg flex items-center justify-center transition-all"
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
                : 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 active:scale-95 text-white shadow-brand-500/25'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5" />
                <span>تمت الإضافة إلى السلة بنجاح!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>إضافة إلى السلة الموحدة ({totalTND.toFixed(2)} د.ت)</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
