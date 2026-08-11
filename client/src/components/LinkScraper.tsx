import React, { useState } from 'react';
import { Link2, Loader2, Clipboard, ArrowRight } from 'lucide-react';
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
      // Clipboard permissions
    }
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      onError("Veuillez d'abord coller le lien d'un produit.");
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
        throw new Error(data.error || "Impossible d'extraire les données du lien.");
      }

      onExtracted(data.product);
    } catch (err: any) {
      console.error('[Link Scrape Error]', err);
      onError(err.message || "Le site source bloque l'accès direct. Nous vous conseillons de déposer une capture d'écran (Screenshot) pour un résultat immédiat.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#160e33]/80 border border-[#332266] rounded-3xl p-5 sm:p-8">
      <form onSubmit={handleScrape} className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="link-input" className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-[#a384ff]" />
            <span>Collez le lien direct (SHEIN, Amazon, TEMU, AliExpress) :</span>
          </label>
          <button
            type="button"
            onClick={handlePaste}
            className="text-[11px] font-semibold text-[#a384ff] hover:text-white flex items-center gap-1 bg-[#673de6]/20 px-2.5 py-1 rounded-lg border border-[#673de6]/30 transition-colors"
          >
            <Clipboard className="w-3 h-3" />
            <span>Coller</span>
          </button>
        </div>

        <div className="relative">
          <input
            id="link-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.shein.com/... ou https://www.amazon.com/..."
            dir="ltr"
            disabled={isLoading}
            className="w-full bg-[#0c081a]/90 border border-[#332266] focus:border-[#7e57ff] rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#673de6]/30 transition-all font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full hostinger-btn disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-[#673de6]/20 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Récupération des informations de l'article...</span>
            </>
          ) : (
            <>
              <span>Calculer le prix et afficher les détails</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
