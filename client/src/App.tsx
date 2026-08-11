import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { ScreenshotUploader } from './components/ScreenshotUploader';
import { LinkScraper } from './components/LinkScraper';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { Footer } from './components/Footer';
import { ScrapedProduct, CartItem, OrderResult } from './types';
import { Camera, Link2, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'screenshot' | 'link'>('screenshot');
  const [extractedProduct, setExtractedProduct] = useState<ScrapedProduct | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputSectionRef = useRef<HTMLDivElement>(null);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

  // Session ID management
  const getSessionId = () => {
    let id = localStorage.getItem('ayrovi_session_id');
    if (!id) {
      id = 'ayr_' + Math.random().toString(36).substring(2, 12);
      localStorage.setItem('ayrovi_session_id', id);
    }
    return id;
  };

  // Fetch Cart Items from server
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
    window.scrollTo({ top: 460, behavior: 'smooth' });
  };

  const handleError = (msg: string) => {
    setErrorMessage(msg);
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
        setIsCartOpen(true);
      }
    } catch (err) {
      console.error('[Add to Cart Error]', err);
    }
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
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (result: OrderResult) => {
    setIsCheckoutOpen(false);
    setOrderResult(result);
    setCartItems([]);
  };

  const handleScrollToInput = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-[#1d2130] bg-[#f8f9fe]">
      {/* Navbar with Transparent Glass Look */}
      <Navbar
        cartCount={totalCartCount}
        cartTotal={totalCartTND}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Hero Carousel Slider */}
      <HeroSlider onCtaClick={handleScrollToInput} />

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6 sm:space-y-8 flex-1">
        
        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold max-w-2xl mx-auto shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-600 hover:text-red-800 text-xs px-2 py-1 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Switcher Tabs */}
        <div ref={inputSectionRef} className="max-w-xl mx-auto pt-2">
          <div className="bg-white border border-[#e2e8f0] p-1.5 rounded-2xl grid grid-cols-2 gap-1.5 shadow-xs">
            <button
              onClick={() => {
                setActiveTab('screenshot');
                setErrorMessage(null);
              }}
              className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                activeTab === 'screenshot'
                  ? 'hostinger-btn text-white shadow-xs'
                  : 'text-[#6b7280] hover:text-[#1d2130] hover:bg-[#f4f5fa]'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Capture d'écran (Screenshot)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('link');
                setErrorMessage(null);
              }}
              className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                activeTab === 'link'
                  ? 'hostinger-btn text-white shadow-xs'
                  : 'text-[#6b7280] hover:text-[#1d2130] hover:bg-[#f4f5fa]'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>Lien Direct</span>
            </button>
          </div>
        </div>

        {/* Active Input Component */}
        <div className="max-w-2xl mx-auto">
          {activeTab === 'screenshot' ? (
            <ScreenshotUploader
              onExtracted={handleExtracted}
              onError={handleError}
            />
          ) : (
            <LinkScraper
              onExtracted={handleExtracted}
              onError={handleError}
            />
          )}
        </div>

        {/* Extracted Product Result */}
        {extractedProduct && (
          <div id="product-card-section" className="pt-2 max-w-3xl mx-auto">
            <ProductCard
              product={extractedProduct}
              onAddToCart={handleAddToCart}
              onReset={() => setExtractedProduct(null)}
            />
          </div>
        )}

      </main>

      {/* Cart Drawer */}
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

      {/* Order Success Modal */}
      <OrderSuccessModal
        result={orderResult}
        onClose={() => setOrderResult(null)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};
