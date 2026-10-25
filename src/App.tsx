import React, { useState, useEffect } from 'react';
import { ActiveView, Product, CartItem, ProjectReel } from './types';
import { INITIAL_CART, PROJECT_REELS } from './data/catalog';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { VideoReelModal } from './components/VideoReelModal';
import { CadBlueprintModal } from './components/CadBlueprintModal';
import { ProformaModal } from './components/ProformaModal';
import { AdminApp } from './admin/AdminApp';

import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { ProductDetailView } from './views/ProductDetailView';
import { ProjectsView } from './views/ProjectsView';
import { OrderListView } from './views/OrderListView';
import { CustomQuoteView } from './views/CustomQuoteView';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      return 'admin';
    }
    return 'home';
  });
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals state
  const [selectedReel, setSelectedReel] = useState<ProjectReel | null>(null);
  const [isCadOpen, setIsCadOpen] = useState(false);
  const [isProformaOpen, setIsProformaOpen] = useState(false);

  // Toast handler
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((current) => (current === msg ? null : current));
    }, 3000);
  };

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  // Cart operations
  const handleAddToCart = (productOrItem: Product | Omit<CartItem, 'id'>, quantity: number = 1) => {
    setCart((prev) => {
      const isFullItem = 'sku' in productOrItem && 'unitPrice' in productOrItem;
      const sku = isFullItem ? (productOrItem as Omit<CartItem, 'id'>).sku : (productOrItem as Product).code;

      const existingIndex = prev.findIndex((item) => item.sku === sku);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        showToast(`Updated quantity for ${sku} (+${quantity})`);
        return updated;
      } else {
        const newItem: CartItem = isFullItem
          ? {
              ...(productOrItem as Omit<CartItem, 'id'>),
              id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              quantity
            }
          : {
              id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              productId: (productOrItem as Product).id,
              sku: (productOrItem as Product).code,
              title: (productOrItem as Product).title,
              image: (productOrItem as Product).image,
              unitPrice: (productOrItem as Product).price,
              quantity,
              moq: 1,
              unitLabel: (productOrItem as Product).unit,
              finish: (productOrItem as Product).finish,
              sizeOrSpec: 'Standard Bay 1200mm x 1675mm',
              gauge: '1.6mm Commercial Heavy Gauge',
              packingType: 'Heavy Crated Packing'
            };

        showToast(`Added ${newItem.title} to B2B Order List!`);
        return [...prev, newItem];
      }
    });
  };

  const handleUpdateQty = (id: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, qty) } : item))
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Removed item from Order List');
  };

  const handleOpenReel = (reel?: ProjectReel) => {
    if (reel) {
      setSelectedReel(reel);
    } else {
      setSelectedReel(PROJECT_REELS[0]);
    }
  };

  // Consignee state for Proforma modal
  const consignee = {
    storeName: 'Kalyan Silks Boutique',
    ownerName: 'Rajesh Kalyan',
    whatsapp: '9849023456',
    destination: 'Vijayawada, AP',
    pincode: '520002',
    launchDate: 'Within 7 Days',
    notes: 'Need 1.8mm heavy duty upright posts for denim weight load; boutique opening scheduled next Friday in Vijayawada.'
  };

  const rawSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  if (activeView === 'admin') {
    return <AdminApp onExitAdmin={() => setActiveView('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#fdf9f3] text-[#1c1c18] font-sans flex flex-col selection:bg-[#fece57] selection:text-black antialiased">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-24 right-6 z-50 bg-[#1a1c20] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#fece57]/40 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-[#25D366] text-[20px]">check_circle</span>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        cart={cart}
      />

      {/* Main Screen Router */}
      <main className="flex-1 w-full pt-18 sm:pt-22">
        {activeView === 'home' && (
          <HomeView
            setActiveView={setActiveView}
            onAddToCart={(prod, qty) => handleAddToCart(prod, qty || 1)}
            onOpenReel={handleOpenReel}
            onToast={showToast}
          />
        )}

        {(activeView === 'racks-floor-stands' ||
          activeView === 'wall-systems-channels' ||
          activeView === 'mannequins-forms' ||
          activeView === 'luxury-gold-fixtures' ||
          activeView === 'hangers-accessories') && (
          <CatalogView
            setActiveView={setActiveView}
            onAddToCart={(prod, qty) => handleAddToCart(prod, qty || 1)}
            onToast={showToast}
            cartCount={cart.length}
            cartSubtotal={rawSubtotal}
          />
        )}

        {activeView === 'pdp' && (
          <ProductDetailView
            onNavigate={setActiveView}
            onAddToCart={handleAddToCart}
            onOpenCad={() => setIsCadOpen(true)}
            onOpenReel={handleOpenReel}
          />
        )}

        {activeView === 'shop-setup-projects' && (
          <ProjectsView
            onNavigate={setActiveView}
            onOpenReel={handleOpenReel}
          />
        )}

        {activeView === 'quote-cart' && (
          <OrderListView
            onNavigate={setActiveView}
            cart={cart}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveFromCart}
            onOpenProforma={() => setIsProformaOpen(true)}
          />
        )}

        {activeView === 'custom-quote' && (
          <CustomQuoteView
            onNavigate={setActiveView}
            onAddToCart={handleAddToCart}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer setActiveView={setActiveView} />

      {/* Floating WhatsApp Specialist Drawer */}
      <FloatingWhatsApp />

      {/* Video Reel Modal */}
      <VideoReelModal
        reel={selectedReel}
        onClose={() => setSelectedReel(null)}
      />

      {/* Architectural CAD Blueprint Modal */}
      <CadBlueprintModal
        isOpen={isCadOpen}
        onClose={() => setIsCadOpen(false)}
        sku="AD-TPR-739"
        modelName="Commercial Triple Pipe Rack System"
      />

      {/* Proforma Invoice Modal */}
      <ProformaModal
        isOpen={isProformaOpen}
        onClose={() => setIsProformaOpen(false)}
        cart={cart}
        consignee={consignee}
      />
    </div>
  );
}
