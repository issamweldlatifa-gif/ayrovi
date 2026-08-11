import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { ScrapedProduct } from '../types';

interface ScreenshotUploaderProps {
  onExtracted: (product: ScrapedProduct) => void;
  onError: (msg: string) => void;
}

export const ScreenshotUploader: React.FC<ScreenshotUploaderProps> = ({ onExtracted, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      onError('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/extract-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Impossible d'analyser la capture d'écran.");
      }

      onExtracted(data.product);
    } catch (err: any) {
      console.error('[Upload Error]', err);
      onError(err.message || "Une erreur est survenue lors de l'analyse. Vous pouvez renseigner le prix manuellement.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-3xl p-6 sm:p-10 transition-all duration-300 border-2 border-dashed flex flex-col items-center justify-center text-center overflow-hidden ${
          isDragging
            ? 'border-[#7e57ff] bg-[#673de6]/15 scale-[1.01]'
            : 'border-[#673de6]/40 bg-[#160e33]/80 hover:bg-[#1a113d] hover:border-[#7e57ff]'
        } ${isLoading ? 'pointer-events-none' : ''}`}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#0c081a]/90 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-[#673de6]/20 border-t-[#7e57ff] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#a384ff] animate-pulse" />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">Analyse de la capture en cours...</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xs">
              Extraction du prix original et calcul de la conversion en Dinars Tunisiens
            </p>
          </div>
        )}

        {/* Icon & Visual Graphic */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#673de6]/30 to-[#7e57ff]/10 border border-[#673de6]/40 flex items-center justify-center shadow-lg shadow-[#673de6]/15 mb-4">
          <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-[#a384ff]" />
        </div>

        {/* Text Guidelines */}
        <h3 className="text-base sm:text-xl font-black text-white mb-2">
          Importez votre capture d'écran <span className="text-[#a384ff]">(Screenshot)</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-4">
          Prenez une capture d'écran du produit ou de votre panier sur <strong className="text-slate-200">SHEIN</strong>, <strong className="text-slate-200">Amazon</strong>, ou <strong className="text-slate-200">TEMU</strong> et déposez-la ici.
        </p>

        {/* Action Button */}
        <div className="inline-flex items-center gap-2 hostinger-btn text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all">
          <ImageIcon className="w-4 h-4" />
          <span>Sélectionner une photo / Galerie</span>
        </div>
      </div>
    </div>
  );
};
