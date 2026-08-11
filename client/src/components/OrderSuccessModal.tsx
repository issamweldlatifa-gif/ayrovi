import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MessageSquare, PackageCheck, Copy } from 'lucide-react';
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
          colors: ['#673de6', '#7e57ff', '#a384ff', '#10b981', '#38bdf8'],
        });
      } catch {}
    }
  }, [result]);

  if (!result) return null;

  const whatsappMessage = encodeURIComponent(
    `Bonjour AYROVI 👋\nJe viens de valider une commande sur votre site :\n\n` +
    `🔖 Réf Commande : ${result.orderNumber}\n` +
    `👤 Nom : ${result.customer.name}\n` +
    `📞 Téléphone : ${result.customer.phone}\n` +
    `📍 Ville/Adresse : ${result.customer.city} - ${result.customer.address}\n` +
    `💰 Montant Total : ${result.totalTND.toFixed(2)} DT\n\n` +
    `Merci de me confirmer la préparation et l'expédition !`
  );

  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(result.orderNumber);
    alert(`Numéro de commande copié : ${result.orderNumber}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0c081a]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#130d28] border border-[#332266] rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-5">
        
        {/* Celebration Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/15">
          <PackageCheck className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
            Félicitations ! Commande enregistrée 🎉
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Merci de votre confiance chez AYROVI. Notre équipe va vous contacter par téléphone pour confirmer l'expédition.
          </p>
        </div>

        {/* Order Number Box */}
        <div className="bg-[#0c081a] border border-[#673de6]/40 rounded-2xl p-4 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Numéro de Commande :</span>
            <span className="text-lg font-mono font-black text-[#a384ff]">{result.orderNumber}</span>
          </div>
          <button
            onClick={handleCopyOrderNumber}
            className="p-2 rounded-xl bg-[#170e33] border border-[#332266] text-slate-300 hover:text-white transition-colors"
            title="Copier le numéro"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        {/* Customer & Total Details */}
        <div className="bg-[#0c081a]/60 border border-[#332266]/80 rounded-2xl p-3.5 text-xs text-slate-300 space-y-1.5 text-left">
          <div className="flex justify-between">
            <span className="text-slate-400">Client :</span>
            <span className="font-bold text-white">{result.customer.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Gouvernorat :</span>
            <span className="font-bold text-white">{result.customer.city}</span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-[#332266] font-black">
            <span className="text-slate-300">Total à régler :</span>
            <span className="text-[#a384ff] text-sm">{result.totalTND.toFixed(2)} DT</span>
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
          <span>Suivre ma commande sur WhatsApp</span>
        </a>

        {/* Close & Continue CTA */}
        <button
          onClick={onClose}
          className="w-full bg-[#170e33] hover:bg-[#24164f] text-white font-bold py-3 px-4 rounded-xl text-xs border border-[#332266] transition-colors"
        >
          Retourner à l'accueil
        </button>

      </div>
    </div>
  );
};
