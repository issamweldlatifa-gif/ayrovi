import React, { useState } from 'react';
import { X, CheckCircle2, Truck, Loader2, ShieldCheck, Phone, MapPin, User, CreditCard } from 'lucide-react';
import { CustomerInfo, OrderResult } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalTND: number;
  itemCount: number;
  onOrderSuccess: (result: OrderResult) => void;
}

const TUNISIAN_GOVERNORATES = [
  'تونس (Tunis)',
  'أريانة (Ariana)',
  'بن عروس (Ben Arous)',
  'منوبة (Manouba)',
  'نابل (Nabeul)',
  'زغوان (Zaghouan)',
  'بنزرت (Bizerte)',
  'باجة (Béja)',
  'جندوبة (Jendouba)',
  'الكاف (Le Kef)',
  'سليانة (Siliana)',
  'سوسة (Sousse)',
  'المنستير (Monastir)',
  'المهدية (Mahdia)',
  'صفاقس (Sfax)',
  'القيروان (Kairouan)',
  'القصرين (Kasserine)',
  'سيدي بوزيد (Sidi Bouzid)',
  'قابس (Gabès)',
  'مدنين (Médenine)',
  'تطاوين (Tataouine)',
  'قفصة (Gafsa)',
  'توزر (Tozeur)',
  'قبلي (Kébili)',
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  totalTND,
  itemCount,
  onOrderSuccess,
}) => {
  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    phone: '',
    city: TUNISIAN_GOVERNORATES[0],
    address: '',
    paymentMethod: 'cod',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError('يرجى ملء كافة البيانات المطلوبة لضمان التوصيل السريع.');
      return;
    }

    if (formData.phone.replace(/\D/g, '').length < 8) {
      setError('يرجى إدخال رقم هاتف تونسي صالح (8 أرقام).');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'حدث خطأ أثناء تأكيد الطلب.');
      }

      onOrderSuccess({
        orderNumber: data.orderNumber,
        customer: formData,
        totalTND: data.totalTND || totalTND,
        itemCount,
        message: data.message || 'تم تسجيل طلبك بنجاح لدى AYROVI!',
      });
    } catch (err: any) {
      console.error('[Checkout Error]', err);
      setError(err.message || 'حدث خطأ أثناء تأكيد الطلب.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">تأكيد الطلب والتوصيل</h3>
              <p className="text-xs text-slate-400 font-medium">توصيل سريع لكافة معتمديات الجمهورية التونسية 🇹🇳</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400 font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-400" />
              <span>الاسم واللقب:</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: أنيس بن عمار"
              className="w-full bg-slate-950 border border-slate-700/80 focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none placeholder:text-slate-500 font-semibold"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-400" />
              <span>رقم الهاتف (للتواصل والتوصيل):</span>
            </label>
            <input
              type="tel"
              required
              dir="ltr"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+216 98 123 456"
              className="w-full bg-slate-950 border border-slate-700/80 focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none placeholder:text-slate-500 font-mono font-semibold text-right"
            />
          </div>

          {/* Governorate */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              <span>الولاية:</span>
            </label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700/80 focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none font-semibold"
            >
              {TUNISIAN_GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>

          {/* Address & Delegation */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              العنوان بالتفصيل، المعتمدية والترقيم البريدي:
            </label>
            <textarea
              required
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="مثال: حي النصر 2، نهج الهادي نويرة، عمارة الأمل شقة 4"
              className="w-full bg-slate-950 border border-slate-700/80 focus:border-brand-500 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none placeholder:text-slate-500 font-semibold resize-none"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-brand-400" />
              <span>طريقة الدفع:</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  formData.paymentMethod === 'cod'
                    ? 'border-brand-500 bg-brand-500/10 text-white'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <span>💵 الدفع عند الاستلام</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'd17' })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  formData.paymentMethod === 'd17'
                    ? 'border-brand-500 bg-brand-500/10 text-white'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <span>📱 D17 / Flouci / تحويل</span>
              </button>
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 flex justify-between items-center text-xs">
            <span className="text-slate-400 font-semibold">المبلغ الإجمالي للدفع عند الاستلام:</span>
            <span className="text-base font-black text-brand-400">{totalTND.toFixed(2)} د.ت</span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-50 text-white font-black py-3.5 px-6 rounded-2xl shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جارٍ تأكيد الطلب وتوليد رقم التتبع...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>تأكيد الطلب النهائي ({totalTND.toFixed(2)} د.ت)</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
