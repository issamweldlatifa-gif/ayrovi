import React from 'react';
import { Sparkles, ShieldCheck, Truck, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-6 pb-4 sm:py-10 text-center max-w-4xl mx-auto px-4">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Banner Tag */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs sm:text-sm font-bold mb-4 shadow-sm">
        <Sparkles className="w-4 h-4" />
        <span>الاستخراج البصري بالذكاء الاصطناعي (1 EUR/USD = 4.00 DT)</span>
      </div>

      {/* Main Title */}
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight sm:leading-snug mb-3">
        ارفع لقطة الشاشة <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-400">(Screenshot)</span> أو الصق الرابط
      </h1>

      {/* Subtitle */}
      <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
        التقط لقطة شاشة من تطبيق <strong className="text-white">SHEIN</strong> أو <strong className="text-white">Amazon</strong> أو <strong className="text-white">TEMU</strong> أو <strong className="text-white">AliExpress</strong>، وسيقوم الذكاء الاصطناعي باستخراج السعر الأصلي وحساب التكلفة بالدينار التونسي والتوصيل حتى باب منزلك.
      </p>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xl mx-auto text-slate-300 text-[11px] sm:text-xs font-semibold">
        <div className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>قراءة فورية للأسعار</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>شفافية تامة بالدينار</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <Truck className="w-3.5 h-3.5 text-blue-400" />
          <span>توصيل لكافة الولايات</span>
        </div>
      </div>
    </section>
  );
};
