import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { ScrapedProduct } from '../types';

interface ScreenshotUploaderProps {
  onExtracted: (product: ScrapedProduct) => void;
  onError: (msg: string) => void;
}

export const ScreenshotUploader: React.FC<ScreenshotUploaderProps> = ({ onExtracted, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      onError('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP).');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
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
        throw new Error(data.error || 'تعذر استخراج بيانات لقطة الشاشة.');
      }

      onExtracted(data.product);
    } catch (err: any) {
      console.error('[Upload Error]', err);
      onError(err.message || 'حدث خطأ أثناء قراءة لقطة الشاشة. يمكنك إدخال السعر يدوياً.');
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
            ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
            : 'border-brand-500/40 bg-slate-900/80 hover:bg-slate-900 hover:border-brand-500/80'
        } ${isLoading ? 'pointer-events-none' : ''}`}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-brand-400 animate-pulse" />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">جارٍ تحليل لقطة الشاشة بالذكاء الاصطناعي...</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xs">
              نستخرج السعر الأصلي، اسم المتجر، وتفاصيل الطلب بالدينار التونسي
            </p>
          </div>
        )}

        {/* Icon & Visual Graphic */}
        <div className="relative mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-brand-500/20 to-amber-500/10 border border-brand-500/30 flex items-center justify-center shadow-lg shadow-brand-500/10">
            <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-brand-400" />
          </div>
          <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-brand-500 text-white text-[10px] font-black uppercase tracking-wider shadow">
            OCR ذكي
          </span>
        </div>

        {/* Text Guidelines */}
        <h3 className="text-base sm:text-xl font-black text-white mb-2">
          اضغط هنا لاختيار لقطة الشاشة <span className="text-brand-400">(Screenshot)</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-4">
          قم بتصوير شاشة المنتج من تطبيق <strong className="text-slate-200">SHEIN</strong> أو <strong className="text-slate-200">Amazon</strong> أو <strong className="text-slate-200">TEMU</strong> أو سلة الشراء، وسيقوم النظام بقراءتها تلقائياً.
        </p>

        {/* Mobile Action Buttons */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all">
          <ImageIcon className="w-4 h-4" />
          <span>فتح المعرض أو الكاميرا</span>
        </div>
      </div>
    </div>
  );
};
