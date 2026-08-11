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
      // Clipboard
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
      onError(err.message || "Le site source bloque l'accès direct. Déposez plutôt une capture d'écran pour un calcul instantané.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full white-card rounded-3xl p-5 sm:p-8">
      <form onSubmit={handleScrape} className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="link-input" className="text-xs sm:text-sm font-bold text-[#1d2130] flex items-center gap-2">
            <Link2 className="w-4 h-4 text-[#673de6]" />
            <span>Collez le lien direct (SHEIN, Amazon, TEMU, AliExpress) :</span>
          </label>
          <button
            type="button"
            onClick={handlePaste}
            className="text-[11px] font-semibold text-[#673de6] hover:text-[#5025d1] flex items-center gap-1 bg-[#673de6]/10 px-2.5 py-1 rounded-lg border border-[#673de6]/20 transition-colors"
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
            className="w-full bg-[#f8f9fe] border border-[#e2e8f0] focus:border-[#673de6] rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-[#1d2130] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#673de6]/20 transition-all font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full hostinger-btn disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Calcul du prix en cours...</span>
            </>
          ) : (
            <>
              <span>Calculer le prix en Dinars Tunisiens</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
