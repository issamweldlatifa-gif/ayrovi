import React, { useState } from 'react';
import { Link2, Loader2, Sparkles, Clipboard, ArrowLeft } from 'lucide-react';
import { ScrapedProduct } from '../types';

interface LinkScraperProps {
  onExtracted: (product: ScrapedProduct) => void;
  onError: (msg: string) => void;
}

export const LinkScraper: React.FC<LinkScraperProps> = ({ onExtracted, onError }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
      }
    } catch {
      // Clipboard permissions denied
    }
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      onError('يرجى لصق رابط المنتج أولاً.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'تعذر استخراج بيانات الرابط.');
      }

      onExtracted(data.product);
    } catch (err: any) {
      console.error('[Link Scrape Error]', err);
      onError(err.message || 'تعذر جلب بيانات الرابط مباشرة بسبب حماية الموقع، يمكنك رفع لقطة شاشة (Screenshot) كبديل دقيق وسريع.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-8">
      <form onSubmit={handleScrape} className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="link-input" className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-brand-400" />
            <span>الصق رابط المنتج (SHEIN, Amazon, TEMU, AliExpress):</span>
          </label>
          <button
            type="button"
            onClick={handlePaste}
            className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20 transition-colors"
          >
            <Clipboard className="w-3 h-3" />
            <span>لصق من الحافظة</span>
          </button>
        </div>

        <div className="relative">
          <input
            id="link-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.shein.com/... أو https://www.amazon.com/..."
            dir="ltr"
            disabled={isLoading}
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-brand-500 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جارٍ جلب وتحليل الرابط...</span>
            </>
          ) : (
            <>
              <span>استخراج سعر وتفاصيل المنتج</span>
              <ArrowLeft className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
