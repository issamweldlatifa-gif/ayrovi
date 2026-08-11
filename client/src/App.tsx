import React, { useState, useEffect } from 'react';
import { TopAnnouncementBar } from './components/TopAnnouncementBar';
import { Navbar } from './components/Navbar';
import { MenuDrawer } from './components/MenuDrawer';
import { HeroSlider } from './components/HeroSlider';
import { PartnerBrandsSlider } from './components/PartnerBrandsSlider';
import { AboutSection } from './components/AboutSection';
import { BottomNavBar } from './components/BottomNavBar';
import { ProductDrawer } from './components/ProductDrawer';
import { AiAssistantDrawer } from './components/assistant/AiAssistantDrawer';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { Footer } from './components/Footer';
import { ScrapedProduct, CartItem, OrderResult } from './types';
import { AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [extractedProduct, setExtractedProduct] = useState<ScrapedProduct | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Drawer States (Mutually Exclusive)
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);

  // Cart & Checkout State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

  // Session ID Management
  const getSessionId = () => {
    let id = localStorage.getItem('ayrovi_session_id');
    if (!id) {
      id = 'ayr_' + Math.random().toString(36).substring(2, 12);
      localStorage.setItem('ayrovi_session_id', id);
    }
    return id;
  };

  // Fetch Cart Items
  const fetchCart = async () => {
    try {
      const sessionId = getSessionId();
      const res = await fetch('/api/cart/items', {
        headers: { 'x-session-id': sessionId },
      });
      const data = await res.json();
      if (data.success && data.items) {
        setCartItems(data.items);
      }
    } catch (err) {
      console.warn('[Cart Fetch Error]', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const totalCartTND = cartItems.reduce((sum, item) => sum + item.priceTND * item.quantity, 0);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleExtracted = (product: ScrapedProduct) => {
    setExtractedProduct(product);
    setErrorMessage(null);
    setIsAiDrawerOpen(false);
    setIsMenuDrawerOpen(false);
    setIsProductDrawerOpen(true);
  };

  const handleError = (msg: string) => {
    setErrorMessage(msg);
  };

  const handleToggleProductDrawer = () => {
    if (isProductDrawerOpen) {
      setIsProductDrawerOpen(false);
    } else {
      setIsAiDrawerOpen(false);
      setIsMenuDrawerOpen(false);
      setIsProductDrawerOpen(true);
    }
  };

  const handleToggleAiDrawer = () => {
    if (isAiDrawerOpen) {
      setIsAiDrawerOpen(false);
    } else {
      setIsProductDrawerOpen(false);
      setIsMenuDrawerOpen(false);
      setIsAiDrawerOpen(true);
    }
  };

  const handleAddToCart = async (itemData: any) => {
    const sessionId = getSessionId();
    try {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify(itemData),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCart();
      }
    } catch (err) {
      console.error('[Add to Cart Error]', err);
    }
  };

  const handleNewClientOrder = () => {
    setExtractedProduct(null);
  };

  const handleUpdateQuantity = async (id: string, newQty: number) => {
    try {
      await fetch(`/api/cart/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }),
      });
      await fetchCart();
    } catch (err) {
      console.error('[Update Qty Error]', err);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await fetch(`/api/cart/items/${id}`, { method: 'DELETE' });
      await fetchCart();
    } catch (err) {
      console.error('[Remove Item Error]', err);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsProductDrawerOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (result: OrderResult) => {
    setIsCheckoutOpen(false);
    setOrderResult(result);
    setCartItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-[#1d2130] bg-white relative pb-20 sm:pb-24">
      
      {/* Top Yellow Notice Bar */}
      <TopAnnouncementBar onLearnMore={handleToggleProductDrawer} />

      {/* Header: Left Menu, Center Fig Logo + AYROVI, Right Profile */}
      <Navbar
        onOpenMenuDrawer={() => setIsMenuDrawerOpen(true)}
      />

      {/* Sliding Side Menu Drawer */}
      <MenuDrawer
        isOpen={isMenuDrawerOpen}
        onClose={() => setIsMenuDrawerOpen(false)}
        onOpenProductDrawer={() => {
          setIsMenuDrawerOpen(false);
          setIsAiDrawerOpen(false);
          setIsProductDrawerOpen(true);
        }}
        onOpenAiDrawer={() => {
          setIsMenuDrawerOpen(false);
          setIsProductDrawerOpen(false);
          setIsAiDrawerOpen(true);
        }}
        onOpenCart={() => {
          setIsMenuDrawerOpen(false);
          setIsCartOpen(true);
        }}
      />

      {/* Full-image fashion hero */}
      <HeroSlider />

      {/* Error Message Notification */}
      {errorMessage && (
        <div className="max-w-2xl mx-auto px-4 mt-6">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-600 hover:text-red-800 text-xs px-2 py-1 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Partner Brands Marquee Slider Container with generous spacing */}
      <PartnerBrandsSlider />

      {/* About & Trust Section (3 Value Pillars) */}
      <AboutSection />

      {/* Hostinger-Style Full Footer with Fig Logo, Qui sommes-nous, Payment & Social Icons */}
      <Footer />

      {/* Floating Scroll To Top FAB Button */}
      <ScrollToTopButton />

      {/* Instagram-Style Floating Transparent White Glass Bottom Nav Bar (AI Icon on Left, Lens Icon on Right) */}
      <BottomNavBar
        isAiDrawerOpen={isAiDrawerOpen}
        isProductDrawerOpen={isProductDrawerOpen}
        cartCount={totalCartCount}
        onToggleAiDrawer={handleToggleAiDrawer}
        onToggleProductDrawer={handleToggleProductDrawer}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* DRAWER 1: Complete 100% Height Product Flow Drawer (Lens Button) */}
      <ProductDrawer
        isOpen={isProductDrawerOpen}
        product={extractedProduct}
        onClose={() => setIsProductDrawerOpen(false)}
        onAddToCart={handleAddToCart}
        onExtracted={handleExtracted}
        onNewClientOrder={handleNewClientOrder}
      />

      {/* Modular AYROVI assistant interface */}
      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
      />

      {/* Slide-in Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        totalTND={totalCartTND}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totalTND={totalCartTND}
        itemCount={totalCartCount}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Success Confetti Modal */}
      <OrderSuccessModal
        result={orderResult}
        onClose={() => setOrderResult(null)}
      />

    </div>
  );
};
