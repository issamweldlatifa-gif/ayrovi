import React, { useState, useRef, useEffect } from 'react';
import { X, ArrowUp, Pause, Mic, Copy, RefreshCw, ThumbsUp, ThumbsDown, MessageSquare, Bot, Check } from 'lucide-react';
import { AiLogoIcon } from './Icons';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'rofio';
  text: string;
  fromVoice?: boolean;
  time: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'rofio',
      text: 'Bonjour ! 👋 Je suis Rofio, votre conseiller shopping & devises AYROVI.\n\nJe peux calculer vos prix en Dinars Tunisiens (1 EUR/USD = 4.00 DT), vérifier vos articles SHEIN, Amazon, TEMU, AliExpress, ou suivre l\'acheminement de votre commande.',
      time: 'À l\'instant',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, 'up' | 'down'>>({});

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isGenerating]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordSeconds(0);
      recordIntervalRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    }
    return () => {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    };
  }, [isRecording]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string, fromVoice = false) => {
    const text = (textToSend || inputText).trim();
    if (!text || isGenerating) return;

    const userMsg: Message = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text,
      fromVoice,
      time: 'À l\'instant',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsGenerating(true);

    // AI Response Stream Simulation
    setTimeout(() => {
      let botResponse = "Je comprends votre demande ! ";
      const lower = text.toLowerCase();

      if (lower.includes('taux') || lower.includes('change') || lower.includes('euro') || lower.includes('dollar')) {
        botResponse = "Notre taux de change garanti chez AYROVI est de : 1 EUR = 4.00 DT et 1 USD = 4.00 DT (et 100 JPY = 2.65 DT). Les frais de douane et de transport express sont inclus dans le calcul final ! 💶";
      } else if (lower.includes('shein') || lower.includes('amazon') || lower.includes('temu') || lower.includes('aliexpress')) {
        botResponse = "Pour commander sur SHEIN, Amazon ou TEMU, il vous suffit de cliquer sur le bouton Lens en bas à droite pour importer votre capture d'écran ou coller le lien direct. Le prix total en Dinars s'affichera immédiatement ! 👗📦";
      } else if (lower.includes('livraison') || lower.includes('délai') || lower.includes('gouvernorat')) {
        botResponse = "Nous livrons partout en Tunisie dans les 24 gouvernorats (Tunis, Sousse, Sfax, Nabeul, Bizerte...). Le délai moyen est de 5 à 8 jours ouvrés avec paiement à la livraison ! 🚚";
      } else if (lower.includes('commande') || lower.includes('suivi')) {
        botResponse = "Pour suivre une commande existante, vous pouvez me donner votre numéro de référence (AYR-2026-XXXX) ou contacter notre équipe directement sur WhatsApp ! 📦";
      } else {
        botResponse = "Bien reçu ! Vous pouvez utiliser le bouton Lens en bas pour importer une capture d'écran ou coller un lien afin de calculer votre montant exact en Dinars Tunisiens.";
      }

      const rofioMsg: Message = {
        id: 'r_' + Date.now(),
        sender: 'rofio',
        text: botResponse,
        time: 'À l\'instant',
      };
      setMessages((prev) => [...prev, rofioMsg]);
      setIsGenerating(false);
    }, 700);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = (id: string) => {
    if (isGenerating) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setIsGenerating(true);
    setTimeout(() => {
      const rofioMsg: Message = {
        id: 'r_' + Date.now(),
        sender: 'rofio',
        text: "Voici une précision actualisée : AYROVI applique un taux fixe de 1 EUR/USD = 4.00 DT sans carte bancaire internationale requise. N'hésitez pas à utiliser le bouton Lens pour importer un article !",
        time: 'À l\'instant',
      };
      setMessages((prev) => [...prev, rofioMsg]);
      setIsGenerating(false);
    }, 600);
  };

  const handleToggleLike = (id: string, type: 'up' | 'down') => {
    setLikedMap((prev) => ({
      ...prev,
      [id]: prev[id] === type ? undefined! : type,
    }));
  };

  const formatRecTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const quickPrompts = [
    '💶 Quel est le taux de change ?',
    '👗 Comment commander sur SHEIN ?',
    '🚚 Délais de livraison en Tunisie',
    '📦 Suivre ma commande',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#0f0730]/75 backdrop-blur-sm transition-opacity"
      />

      {/* Rofio Interface Container (Adapted from ayrovi-interface.html) */}
      <div className="relative w-full max-w-xl mx-auto h-[94vh] bg-[#fbfaf8] rounded-t-[34px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Top Handle Bar */}
        <div className="pt-3 pb-1 flex justify-center bg-white border-b border-slate-100">
          <div className="w-12 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Top Bar Header */}
        <div className="px-5 py-3.5 bg-white border-b border-slate-200/80 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#673de6] text-white flex items-center justify-center shadow-md">
              <AiLogoIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#1d2130]">
                  Rofio — Assistant AI
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-[#6b7280] font-medium">Conseiller shopping & devises AYROVI</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1d2130] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#fbfaf8]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* Voice Tag */}
              {m.fromVoice && (
                <div className="inline-flex items-center gap-1 text-[11px] text-[#6b7280] mb-1 font-semibold">
                  <Mic className="w-3 h-3 text-[#673de6]" />
                  <span>Message vocal</span>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[86%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#673de6] text-white rounded-br-none font-medium'
                    : 'bg-white text-[#1d2130] border border-slate-200/90 rounded-bl-none font-medium shadow-xs'
                }`}
              >
                {m.text}
              </div>

              {/* Action Toolbar for AI responses */}
              {m.sender === 'rofio' && (
                <div className="flex items-center gap-1.5 mt-1.5 px-1 text-slate-400">
                  <button
                    onClick={() => handleCopy(m.id, m.text)}
                    className="p-1 rounded-md hover:bg-slate-200 hover:text-[#1d2130] transition-colors cursor-pointer"
                    title="Copier"
                  >
                    {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleRegenerate(m.id)}
                    className="p-1 rounded-md hover:bg-slate-200 hover:text-[#1d2130] transition-colors cursor-pointer"
                    title="Régénérer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleToggleLike(m.id, 'up')}
                    className={`p-1 rounded-md hover:bg-slate-200 transition-colors cursor-pointer ${
                      likedMap[m.id] === 'up' ? 'text-[#673de6]' : ''
                    }`}
                    title="Utile"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleToggleLike(m.id, 'down')}
                    className={`p-1 rounded-md hover:bg-slate-200 transition-colors cursor-pointer ${
                      likedMap[m.id] === 'down' ? 'text-red-600' : ''
                    }`}
                    title="Pas utile"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isGenerating && (
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200 w-20 text-[#673de6]">
              <div className="w-2 h-2 rounded-full bg-[#673de6] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#673de6] animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-[#673de6] animate-bounce [animation-delay:0.4s]" />
            </div>
          )}

          <div ref={chatBottomRef} />

          {/* Quick Suggestions Chips */}
          <div className="pt-3">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Suggestions rapides :
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  className="bg-white hover:bg-[#673de6] hover:text-white text-[#673de6] border border-slate-200/90 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all shadow-2xs cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-2.5">
          {/* Recording Row if recording */}
          {isRecording && (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold animate-in fade-in">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
              <span>Enregistrement audio en cours : {formatRecTime(recordSeconds)}</span>
              <button
                onClick={() => setIsRecording(false)}
                className="ml-auto text-xs underline text-red-800 cursor-pointer"
              >
                Annuler
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Mic button */}
            <button
              type="button"
              onClick={() => {
                if (!isRecording) setIsRecording(true);
                else {
                  setIsRecording(false);
                  handleSendMessage("Demande vocale enregistrée (" + formatRecTime(recordSeconds) + ")", true);
                }
              }}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all cursor-pointer ${
                isRecording
                  ? 'bg-red-600 text-white border-red-600 animate-pulse'
                  : 'bg-[#f8f9fe] border-slate-200 text-[#6b7280] hover:text-[#673de6]'
              }`}
              title="Enregistrer un message vocal"
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Text input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Écrivez votre message à Rofio..."
              className="flex-1 bg-[#f8f9fe] border border-slate-200 focus:border-[#673de6] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#1d2130] focus:outline-none placeholder:text-slate-400 font-medium"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!inputText.trim() && !isGenerating}
              className="w-11 h-11 rounded-2xl bg-[#673de6] hover:bg-[#5025d1] disabled:opacity-40 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
            >
              {isGenerating ? <Pause className="w-5 h-5" /> : <ArrowUp className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </form>

          {/* WhatsApp Escalation CTA */}
          <a
            href="https://wa.me/?text=Bonjour%20AYROVI%2C%20je%20souhaite%20parler%20%C3%A0%20un%20conseiller%20client"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Besoin d'un agent humain ? Continuer sur WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
