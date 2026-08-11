import React, { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag, Calculator, RefreshCw, Check, Camera, Link2, ArrowUpRight, ArrowRight, Image as ImageIcon, Loader2, Clipboard, Truck, CheckCircle2, User, Phone, MapPin, CreditCard, MessageSquare, Copy, PackageCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScrapedProduct, StoreType, CustomerInfo, OrderResult } from '../types';

interface ProductDrawerProps {
  isOpen: boolean;
  product: ScrapedProduct | null;
  onClose: () => void;
  onAddToCart: (item: any) => void;
  onExtracted: (product: ScrapedProduct) => void;
  onNewClientOrder: () => void;
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

const TUNISIAN_GOVERNORATES_FR = [
  'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
  'Bizerte', 'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Sousse',
  'Monastir', 'Mahdia', 'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid',
  'Gabès', 'Médenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kébili'
];

export const ProductDrawer: React.FC<ProductDrawerProps> = ({
  isOpen,
  product,
  onClose,
  onAddToCart,
  onExtracted,
  onNewClientOrder,
}) => {
  const [step, setStep] = useState<'input' | 'details' | 'checkout' | 'success'>('input');
  
  const [isUploading, setIsUploading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(product?.title || 'Article International');
  const [sourcePrice, setSourcePrice] = useState<number>(product?.sourcePrice || 0);
  const [currency, setCurrency] = useState<string>(product?.sourceCurrency || 'EUR');
  const [variantNote, setVariantNote] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);

  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    phone: '',
    city: TUNISIAN_GOVERNORATES_FR[0],
    address: '',
    paymentMethod: 'cod',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

  useEffect(() => {
    if (product) {
      setTitle(product.title || 'Article International');
      setSourcePrice(product.sourcePrice || 0);
      setCurrency(product.sourceCurrency || 'EUR');
      setStep('details');
    } else {
      setStep('input');
    }
  }, [product]);

  if (!isOpen) return null;

  const rate = RATES_TO_TND[currency] || 4.00;
  const convertedTND = Math.round(sourcePrice * rate * 100) / 100;
  const serviceFeeTND = sourcePrice > 0 ? Math.round(Math.max(10, convertedTND * 0.08) * 100) / 100 : 0;
  const shippingTND = sourcePrice > 0 ? 25.00 : 0;
  const totalTND = sourcePrice > 0 ? Math.round((convertedTND + serviceFeeTND + shippingTND) * 100) / 100 : 0;

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    try {
      const form = new FormData();
      form.append('image', file);

      const response = await fetch('/api/extract-image', {
        method: 'POST',
        body: form,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Impossible d'extraire les données de la capture.");
      }

      onExtracted(data.product);
      setStep('details');
    } catch (err: any) {
      console.error('[Upload Error]', err);
      setErrorMsg(err.message || "Erreur lors de l'analyse. Vous pouvez entrer le montant manuellement.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleScrapeUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setErrorMsg("Veuillez d'abord coller le lien d'un produit.");
      return;
    }

    setIsScraping(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Impossible d'extraire les données du lien.");
      }

      onExtracted(data.product);
      setStep('details');
    } catch (err: any) {
      console.error('[Scrape Error]', err);
      setErrorMsg(err.message || "Le site source bloque l'accès direct. Déposez plutôt une capture d'écran pour un résultat garanti.");
    } finally {
      setIsScraping(false);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrlInput(text.trim());
    } catch {}
  };

  const handleProceedToCheckoutForm = () => {
    if (sourcePrice <= 0) {
      alert("Veuillez renseigner le prix de l'article.");
      return;
    }

    onAddToCart({
      store: product?.store || 'generic',
      externalId: product?.externalId || null,
      url: product?.url || '',
      title: title.trim(),
      imageUrl: product?.mainImage || '',
      sourcePrice: Number(sourcePrice),
      sourceCurrency: currency,
      priceTND: totalTND,
      variant: variantNote.trim() || undefined,
      quantity,
    });

    setStep('checkout');
  };

  const handleFinalOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la confirmation.');
      }

      const result: OrderResult = {
        orderNumber: data.orderNumber,
        customer: formData,
        totalTND: data.totalTND || (totalTND * quantity),
        itemCount: quantity,
        message: 'Commande enregistrée avec succès !',
      };

      setOrderResult(result);
      setStep('success');

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#673de6', '#5025d1', '#7e57ff', '#ffc24b', '#10b981'],
        });
      } catch {}
    } catch (err: any) {
      console.error('[Order Error]', err);
      setErrorMsg(err.message || 'Erreur lors de la commande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForNewClient = () => {
    setStep('input');
    setUrlInput('');
    setErrorMsg(null);
    setOrderResult(null);
    onNewClientOrder();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex flex-col justify-end">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        className="hidden"
      />

      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#0f0730]/75 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-xl mx-auto h-[94vh] bg-white rounded-t-[34px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        <div className="pt-3 pb-1 flex justify-center bg-[#f8f9fe]">
          <div className="w-12 h-1.5 rounded-full bg-slate-300" />
        </div>

        <div className="px-5 py-3.5 border-b border-slate-100 bg-[#f8f9fe] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#673de6] text-white flex items-center justify-center font-black text-xs">
              +
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#1d2130]">
                {step === 'input' && "Nouvelle Commande (Lens)"}
                {step === 'details' && "Fiche de Calcul & Prix (DT)"}
                {step === 'checkout' && "Livraison & Coordonnées"}
                {step === 'success' && "Commande Confirmée"}
              </h3>
              <p className="text-[11px] text-[#6b7280] font-medium">Taux garanti : 1 EUR/USD = 4.00 DT</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-[#1d2130] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-5 mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {step === 'input' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h4 className="font-extrabold text-lg text-[#1d2130]">
                  Comment souhaitez-vous ajouter l'article ?
                </h4>
                <p className="text-xs text-[#6b7280]">
                  Importez une capture d'écran ou collez un lien pour calculer le prix exact en Dinars.
                </p>
              </div>

              {/* Card 1: Screenshot */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`hostinger-purple-card rounded-3xl p-6 text-white cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[190px] group ${
                  isUploading ? 'pointer-events-none' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Méthode Recommandée</span>
                    </span>
                    <h5 className="text-xl font-extrabold tracking-tight mt-1">
                      Capture d'écran (Screenshot)
                    </h5>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-[#673de6] transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs text-purple-100/90 my-2">
                  Prenez une photo de votre article sur SHEIN, Amazon ou TEMU.
                </p>

                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 bg-white text-[#1d2130] px-4 py-2 rounded-xl text-xs font-bold shadow-xs">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#673de6]" />
                        <span>Analyse en cours...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-3.5 h-3.5 text-[#673de6]" />
                        <span>Sélectionner une photo</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Link Direct */}
              <div className="hostinger-purple-card rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[190px]">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1">
                      <Link2 className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Lien URL Direct</span>
                    </span>
                    <h5 className="text-xl font-extrabold tracking-tight mt-1">
                      Coller un Lien Direct
                    </h5>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs text-purple-100/90 my-2">
                  Copiez l'URL de votre article depuis SHEIN, AliExpress ou Amazon.
                </p>

                <form onSubmit={handleScrapeUrl} className="pt-2 space-y-2">
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://www.shein.com/..."
                      dir="ltr"
                      disabled={isScraping}
                      className="w-full bg-white/15 border border-white/25 focus:border-white rounded-xl px-3 py-2 text-xs text-white placeholder:text-purple-200/70 focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={handlePasteClipboard}
                      className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                    >
                      <Clipboard className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isScraping || !urlInput.trim()}
                    className="w-full bg-white text-[#1d2130] hover:bg-yellow-300 disabled:opacity-50 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isScraping ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#673de6]" />
                        <span>Calcul en cours...</span>
                      </>
                    ) : (
                      <>
                        <span>Calculer le prix en Dinars</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-5">
              <div className="bg-[#f8f9fe] border border-slate-200 rounded-2xl p-4 flex gap-4 items-center">
                <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center p-1">
                  {product?.mainImage ? (
                    <img src={product.mainImage} alt={title} className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-2xl">📦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Titre de l'article :
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#673de6] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#1d2130] focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-[#f8f9fe] border border-[#eef0f6] rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1d2130] flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-[#673de6]" />
                    <span>Prix original sur le site :</span>
                  </span>
                  <span className="text-xs font-extrabold text-[#673de6]">
                    1 EUR/USD = 4.00 DT
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#6b7280] font-semibold mb-1">
                      Montant devise :
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={sourcePrice || ''}
                      onChange={(e) => setSourcePrice(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full bg-white border border-slate-200 focus:border-[#673de6] rounded-xl px-3 py-2 text-sm font-black text-[#1d2130] focus:outline-none shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#6b7280] font-semibold mb-1">
                      Devise :
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-[#673de6] rounded-xl px-3 py-2 text-xs font-bold text-[#1d2130] focus:outline-none shadow-xs"
                    >
                      <option value="EUR">Euro (€ EUR) — 4.00 DT</option>
                      <option value="USD">Dollar ($ USD) — 4.00 DT</option>
                      <option value="JPY">Yen (¥ JPY) — 2.65 DT / 100</option>
                      <option value="GBP">Livre (£ GBP) — 4.80 DT</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Prix converti :</span>
                    <span className="font-semibold text-[#1d2130]">{convertedTND.toFixed(2)} DT</span>
                  </div>
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Dédouanement + expédition express :</span>
                    <span className="font-semibold text-[#1d2130]">+{shippingTND.toFixed(2)} DT</span>
                  </div>
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Frais de service & garantie (8% ou 10 DT) :</span>
                    <span className="font-semibold text-[#1d2130]">+{serviceFeeTND.toFixed(2)} DT</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-extrabold text-sm sm:text-base">
                    <span className="text-[#1d2130]">Total à régler :</span>
                    <span className="text-[#673de6] text-lg font-black">{totalTND.toFixed(2)} DT</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4b5563] mb-1">
                    Taille / Couleur :
                  </label>
                  <input
                    type="text"
                    value={variantNote}
                    onChange={(e) => setVariantNote(e.target.value)}
                    placeholder="Ex : M, Noir..."
                    className="w-full bg-[#f8f9fe] border border-slate-200 focus:border-[#673de6] rounded-xl px-3 py-2 text-xs text-[#1d2130] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4b5563] mb-1">
                    Quantité :
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1d2130] font-black flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-[#1d2130] min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1d2130] font-black flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'checkout' && (
            <form onSubmit={handleFinalOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#673de6]" />
                  <span>Nom et Prénom :</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex : Anis Ben Ammar"
                  className="w-full bg-[#f8f9fe] border border-slate-200 focus:border-[#673de6] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1d2130] focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#673de6]" />
                  <span>Téléphone :</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+216 98 123 456"
                  className="w-full bg-[#f8f9fe] border border-slate-200 focus:border-[#673de6] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1d2130] focus:outline-none font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#673de6]" />
                  <span>Gouvernorat :</span>
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#f8f9fe] border border-slate-200 focus:border-[#673de6] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1d2130] focus:outline-none font-semibold"
                >
                  {TUNISIAN_GOVERNORATES_FR.map((gov) => (
                    <option key={gov} value={gov}>{gov}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  Adresse complète :
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ex : Rue Hédi Nouira, Ennasr 2, Apt 4"
                  className="w-full bg-[#f8f9fe] border border-slate-200 focus:border-[#673de6] rounded-xl px-3.5 py-2 text-xs text-[#1d2130] focus:outline-none font-semibold resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#673de6]" />
                  <span>Paiement :</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-[#673de6] bg-[#673de6]/10 text-[#673de6]'
                        : 'border-slate-200 bg-[#f8f9fe] text-slate-500'
                    }`}
                  >
                    <span>💵 À la livraison</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'd17' })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'd17'
                        ? 'border-[#673de6] bg-[#673de6]/10 text-[#673de6]'
                        : 'border-slate-200 bg-[#f8f9fe] text-slate-500'
                    }`}
                  >
                    <span>📱 D17 / Flouci</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {step === 'success' && orderResult && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-xs">
                <PackageCheck className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#1d2130]">
                  Félicitations ! Commande validée 🎉
                </h4>
                <p className="text-xs text-[#6b7280] mt-1">
                  Votre code de suivi est généré et actif chez AYROVI.
                </p>
              </div>

              <div className="bg-[#f8f9fe] border border-[#673de6]/30 rounded-2xl p-4 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] text-[#6b7280] uppercase font-bold block">Code de suivi :</span>
                  <span className="text-lg font-mono font-black text-[#673de6]">{orderResult.orderNumber}</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(orderResult.orderNumber);
                    alert("Code copié : " + orderResult.orderNumber);
                  }}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#1d2130] shadow-2xs cursor-pointer"
                  title="Copier"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Bonjour AYROVI 👋\nJe confirme ma commande :\n🔖 Réf : ${orderResult.orderNumber}\n👤 Nom : ${orderResult.customer.name}\n📍 Ville : ${orderResult.customer.city}\n💰 Total : ${orderResult.totalTND.toFixed(2)} DT`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Suivre ma commande sur WhatsApp</span>
              </a>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-2.5">
          {step === 'details' && (
            <button
              onClick={handleProceedToCheckoutForm}
              disabled={sourcePrice <= 0}
              className="w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md bg-[#673de6] hover:bg-[#5025d1] text-white transition-all cursor-pointer disabled:opacity-50"
            >
              <span>Continuer vers la livraison ({totalTND.toFixed(2)} DT)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 'checkout' && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="py-3.5 px-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-xs text-slate-700 cursor-pointer"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={handleFinalOrderSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3.5 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md bg-[#673de6] hover:bg-[#5025d1] text-white transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirmation en cours...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmer la commande ({(totalTND * quantity).toFixed(2)} DT)</span>
                  </>
                )}
              </button>
            </div>
          )}

          <button
            onClick={handleResetForNewClient}
            className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-[#673de6]/40 bg-[#f1ebff] hover:bg-[#e8defc] text-[#673de6] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors active:scale-98 cursor-pointer"
          >
            <span>➕ Nouvelle commande pour un autre client</span>
          </button>
        </div>

      </div>
    </div>
  );
};
