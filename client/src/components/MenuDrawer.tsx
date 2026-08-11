import React from 'react';
import { X } from 'lucide-react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Menu AYROVI">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-[#140a35]/55 backdrop-blur-sm"
        aria-label="Fermer le menu"
      />

      <div className="fixed inset-y-0 left-0 flex max-w-full">
        <div className="relative w-screen max-w-xs border-r border-[#e4dbff] bg-white shadow-[24px_0_70px_-28px_rgba(29,18,72,0.45)] sm:max-w-sm">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e4dbff] bg-[#f7f4ff] text-[#673de6] shadow-sm transition duration-300 hover:scale-105 hover:bg-[#eee8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#673de6] focus-visible:ring-offset-2"
            title="Fermer"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
