import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus, Package } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalTND: number;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  totalTND,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#0c081a]/85 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pr-0 sm:pr-10">
        <div className="w-screen max-w-md bg-[#130d28] border-l border-[#332266] shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#332266] flex items-center justify-between bg-[#170e33]/90">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#673de6]/20 border border-[#673de6]/30 flex items-center justify-center text-[#a384ff]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">Mon Panier</h2>
                <p className="text-xs text-slate-400 font-semibold">{items.length} article{items.length > 1 ? 's' : ''} dans le panier</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#24164f] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#1b1238] border border-[#332266] flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8 text-[#a384ff]" />
                </div>
                <h3 className="text-base font-bold text-slate-200">Votre panier est vide</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Importez une capture d'écran ou collez un lien pour ajouter des articles.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0c081a]/80 border border-[#332266] rounded-2xl p-3.5 flex gap-3.5 items-start group hover:border-[#673de6]/50 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-[#170e33] border border-[#332266] flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-6 h-6 text-slate-500" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#673de6]/20 text-[#a384ff] uppercase">
                        {item.store}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 truncate mt-1">
                      {item.title}
                    </h4>

                    {item.variant && (
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.variant}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="text-xs font-black text-[#a384ff]">
                        {(item.priceTND * item.quantity).toFixed(2)} DT
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-[#170e33] border border-[#332266] rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#24164f]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#24164f]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#332266] bg-[#0c081a] space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-semibold">Total général de la commande :</span>
                <span className="text-xl font-black text-white">{totalTND.toFixed(2)} DT</span>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full hostinger-btn text-white font-black py-3.5 px-6 rounded-2xl shadow-lg shadow-[#673de6]/25 flex items-center justify-center gap-2 text-sm transition-all"
              >
                <span>Passer la commande et livraison</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
