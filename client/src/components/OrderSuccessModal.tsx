import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, MessageSquare, ArrowRight, PackageCheck, Copy } from 'lucide-react';
import { OrderResult } from '../types';

interface OrderSuccessModalProps {
  result: OrderResult | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ result, onClose }) => {
  useEffect(() => {
    if (result) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f95f36', '#fb8866', '#3b82f6', '#10b981', '#f59e0b'],
        });
      } catch {}
    }
  }, [result]);

  if (!result) return null;

  const whatsappMessage = encodeURIComponent(
    `مرحباً AYROVI 👋\nلقد قمت بتأكيد طلب جديد على الموقع:\n\n` +
    `🔖 رقم الطلب: ${result.orderNumber}\n` +
    `👤 الاسم: ${result.customer.name}\n` +
    `📞 الهاتف: ${result.customer.phone}\n` +
    `📍 الولاية/العنوان: ${result.customer.city} - ${result.customer.address}\n` +
    `💰 المبلغ الإجمالي: ${result.totalTND.toFixed(2)} د.ت\n\n` +
    `يرجى تأكيد تجهيز الشحنة والتوصيل وشكراً!`
  );

  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(result.orderNumber);
    alert(`تم نسخ رقم الطلب: ${result.orderNumber}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-5">
        
        {/* Celebration Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10">
          <PackageCheck className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
            مبروك! تم تسجيل طلبك بنجاح 🎉
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            شكراً لثقتكم بـ AYROVI — سيتم التواصل معكم هاتفياً لتأكيد الشحن.
          </p>
        </div>

        {/* Order Number Box */}
        <div className="bg-slate-950 border border-brand-500/30 rounded-2xl p-4 flex items-center justify-between">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">رقم الطلب الموحد:</span>
            <span className="text-lg font-mono font-black text-brand-400">{result.orderNumber}</span>
          </div>
          <button
            onClick={handleCopyOrderNumber}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="نسخ رقم الطلب"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        {/* Customer & Total Details */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 text-xs text-slate-300 space-y-1.5 text-right">
          <div className="flex justify-between">
            <span className="text-slate-400">العميل:</span>
            <span className="font-bold text-white">{result.customer.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">الولاية:</span>
            <span className="font-bold text-white">{result.customer.city}</span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-slate-800 font-black">
            <span className="text-slate-300">الإجمالي عند الاستلام:</span>
            <span className="text-brand-400 text-sm">{result.totalTND.toFixed(2)} د.ت</span>
          </div>
        </div>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          <span>متابعة الطلب عبر WhatsApp الآن</span>
        </a>

        {/* Close & Continue CTA */}
        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors"
        >
          إغلاق والعودة للرئيسية
        </button>

      </div>
    </div>
  );
};
