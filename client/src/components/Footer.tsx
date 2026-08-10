import React from 'react';
import { ShieldCheck, Truck, Clock, RefreshCw, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/60 pt-12 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-xs">
          
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center font-black text-white text-base">
                A
              </div>
              <span className="text-lg font-black text-white">AYROVI</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              المنصة التونسية الموحدة للشراء عبر الحدود بالدينار التونسي. نتيح لك الشراء من أشهر المواقع العالمية (SHEIN, Amazon, TEMU, AliExpress) بكل شفافية وبدون بطاقة بنكية دولية.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">المتاجر المدعومة</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>👗 SHEIN العالمية</li>
              <li>📦 Amazon (France / USA / Japan)</li>
              <li>🛍️ TEMU</li>
              <li>⚡ AliExpress</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">سعر الصرف والشفافية</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>💶 1 يورو = 4.00 د.ت</li>
              <li>💵 1 دولار = 4.00 د.ت</li>
              <li>💴 100 ين ياباني = 2.65 د.ت</li>
              <li>🚚 توصيل لكافة معتمديات تونس</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} AYROVI. جميع الحقوق محفوظة لجمهورية تونس.</p>
          <p className="flex items-center gap-1">
            صُنِع بكل <Heart className="w-3 h-3 text-brand-500 fill-brand-500" /> لتسهيل التسوق في تونس 🇹🇳
          </p>
        </div>

      </div>
    </footer>
  );
};
