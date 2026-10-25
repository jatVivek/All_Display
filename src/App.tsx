import { AppIcon } from './components/AppIcon';
import React, { useState, useEffect, useRef } from 'react';
import { ActiveView, HomepageBanner, Product, CartItem, ProjectReel, ConsigneeDetails } from './types';
import { PROJECT_REELS } from './data/catalog';
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
import { storeManager } from './services/storeManager';
import { AuthDialog } from './auth/AuthDialog';

const viewPaths: Record<ActiveView, string> = {
  home: '/',
  shop: '/shop',
  'racks-floor-stands': '/shop/racks-and-floor-stands',
  pdp: '/products/triple-pipe-rack-system',
  'shop-setup-projects': '/projects',
  'quote-cart': '/orders',
  'custom-quote': '/quote',
  'wall-systems-channels': '/shop/wall-systems-and-channels',
  'mannequins-forms': '/shop/mannequins-and-dress-forms',
  'luxury-gold-fixtures': '/shop/gold-boutique-fixtures',
  'hangers-accessories': '/shop/hangers-clips-and-hooks',
  admin: '/admin',
};

const defaultCategories: Partial<Record<ActiveView, string>> = {
  'racks-floor-stands': 'Floor Stands & Bumper Racks',
  'wall-systems-channels': 'Wall Systems & Channels',
  'mannequins-forms': 'Mannequins & Dress Forms',
  'luxury-gold-fixtures': 'Gold Luxury Boutique Fixtures',
  'hangers-accessories': 'Hangers, Clips & Hooks',
};

const getRouteFromLocation = () => {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const section = path === '/about-us' ? 'about-us' : path === '/contact-us' ? 'contact-us' : null;
  const view = (Object.entries(viewPaths).find(([, routePath]) => routePath === path)?.[0] ?? 'home') as ActiveView;
  return { view, section, path };
};

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>(() => (
    window.location.hash === '#admin' ? 'admin' : getRouteFromLocation().view
  ));
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('alldisplay_cart');
      const parsedCart: unknown = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsedCart) ? parsedCart as CartItem[] : [];
    } catch {
      return [];
    }
  });
  const [, setStoreVersion] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [bannerCategoryName, setBannerCategoryName] = useState(() => (
    new URLSearchParams(window.location.search).get('category') ||
    defaultCategories[getRouteFromLocation().view] ||
    'All Categories'
  ));
  const [bannerProductId, setBannerProductId] = useState<string | null>(() => (
    new URLSearchParams(window.location.search).get('product')
  ));
  const pendingHomeSectionRef = useRef<string | null>(getRouteFromLocation().section);
  const pendingScrollPositionRef = useRef<number | null>(null);

  // Modals state
  const [selectedReel, setSelectedReel] = useState<ProjectReel | null>(null);
  const [isCadOpen, setIsCadOpen] = useState(false);
  const [isProformaOpen, setIsProformaOpen] = useState(false);
  const [consignee, setConsignee] = useState<ConsigneeDetails>({
    storeName: '',
    ownerName: '',
    whatsapp: '',
    destination: '',
    pincode: '',
    launchDate: '',
    notes: '',
  });

  // Toast handler
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((current) => (current === msg ? null : current));
    }, 3000);
  };

  useEffect(() => {
    const route = getRouteFromLocation();
    if (window.location.hash === '#admin' && route.view !== 'admin') {
      window.history.replaceState({ scrollY: 0 }, '', viewPaths.admin);
    } else if (!route.section && route.path !== viewPaths[route.view]) {
      window.history.replaceState({ scrollY: 0 }, '', viewPaths[route.view]);
    }
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    const sectionId = pendingHomeSectionRef.current;
    if (activeView === 'home' && sectionId) {
      pendingHomeSectionRef.current = null;
      requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }
    const savedScrollPosition = pendingScrollPositionRef.current;
    if (savedScrollPosition !== null) {
      pendingScrollPositionRef.current = null;
      requestAnimationFrame(() => window.scrollTo({ top: savedScrollPosition, behavior: 'instant' }));
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  const navigateToView = (view: ActiveView, path = viewPaths[view]) => {
    window.history.replaceState({ ...(window.history.state || {}), scrollY: window.scrollY }, '');
    if (`${window.location.pathname}${window.location.search}` !== path) {
      window.history.pushState({ scrollY: 0 }, '', path);
    }
    pendingHomeSectionRef.current = null;
    pendingScrollPositionRef.current = null;
    const params = new URLSearchParams(path.split('?')[1] || '');
    setBannerCategoryName(params.get('category') || defaultCategories[view] || 'All Categories');
    setBannerProductId(params.get('product'));
    setActiveView(view);
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const route = getRouteFromLocation();
      const params = new URLSearchParams(window.location.search);
      pendingHomeSectionRef.current = route.section;
      pendingScrollPositionRef.current = route.section
        ? null
        : typeof event.state?.scrollY === 'number' ? event.state.scrollY : null;
      setBannerCategoryName(params.get('category') || defaultCategories[route.view] || 'All Categories');
      setBannerProductId(params.get('product'));
      setActiveView(route.view);
      if (route.view === activeView && route.view === 'home' && route.section) {
        requestAnimationFrame(() => {
          document.getElementById(route.section!)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          pendingHomeSectionRef.current = null;
        });
      } else if (route.view === activeView && pendingScrollPositionRef.current !== null) {
        const scrollY = pendingScrollPositionRef.current;
        pendingScrollPositionRef.current = null;
        requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: 'instant' }));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeView]);

  const navigateToHomeSection = (sectionId: string) => {
    const path = sectionId === 'about-us' ? '/about-us' : '/contact-us';
    window.history.replaceState({ ...(window.history.state || {}), scrollY: window.scrollY }, '');
    window.history.pushState({ scrollY: 0 }, '', path);
    if (activeView === 'home') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    pendingHomeSectionRef.current = sectionId;
    setActiveView('home');
  };

  const navigateToShop = () => {
    setBannerCategoryName('All Categories');
    setBannerProductId(null);
    navigateToView('shop');
  };

  useEffect(() => storeManager.subscribe(() => {
    setStoreVersion((version) => version + 1);
  }), []);

  useEffect(() => {
    try {
      localStorage.setItem('alldisplay_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Could not save the cart locally:', error);
    }
  }, [cart]);

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
              moq: Number((productOrItem as Product).moq.match(/\d+/)?.[0]) || 1,
              unitLabel: (productOrItem as Product).unit,
              finish: (productOrItem as Product).finish,
              sizeOrSpec: Object.entries((productOrItem as Product).specs || {})
                .filter(([, value]) => Boolean(value))
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ') || (productOrItem as Product).structuralProfile,
              gauge: (productOrItem as Product).specs?.gauge || 'Not specified',
              packingType: 'To be confirmed'
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

  const handleOpenBannerTarget = (banner: HomepageBanner) => {
    const categoryName = banner.linkType === 'category'
      ? storeManager.getCategories().find((category) => category.id === banner.linkId)?.name
      : storeManager.getProducts().find((product) => product.id === banner.linkId)?.category;
    const categoryViews: Record<string, ActiveView> = {
      'Floor Stands & Bumper Racks': 'racks-floor-stands',
      'Wall Systems & Channels': 'wall-systems-channels',
      'Mannequins & Dress Forms': 'mannequins-forms',
      'Gold Luxury Boutique Fixtures': 'luxury-gold-fixtures',
      'Hangers, Clips & Hooks': 'hangers-accessories',
    };
    setBannerCategoryName(categoryName || 'All Categories');
    setBannerProductId(banner.linkType === 'product' ? banner.linkId : null);
    const view = categoryViews[categoryName || ''] || 'racks-floor-stands';
    const params = new URLSearchParams();
    if (categoryName) params.set('category', categoryName);
    if (banner.linkType === 'product') params.set('product', banner.linkId);
    navigateToView(view, `${viewPaths[view]}?${params.toString()}`);
  };

  const rawSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  if (activeView === 'admin') {
    return <AdminApp onExitAdmin={() => navigateToView('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#fdf9f3] text-[#1c1c18] font-sans flex flex-col selection:bg-[#fece57] selection:text-black antialiased">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-24 right-6 z-50 bg-[#1a1c20] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#fece57]/40 animate-in fade-in slide-in-from-top-2 duration-200">
          <AppIcon name="check_circle" className="text-[#25D366] text-[20px]" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        activeView={activeView}
        setActiveView={navigateToView}
        onNavigateToShop={navigateToShop}
        onNavigateToSection={navigateToHomeSection}
        cart={cart}
      />
      <AuthDialog />

      {/* Main Screen Router */}
      <main className="flex-1 w-full pt-18 sm:pt-22">
        {activeView === 'home' && (
          <HomeView
            setActiveView={navigateToView}
            onAddToCart={(prod, qty) => handleAddToCart(prod, qty || 1)}
            onToast={showToast}
            onOpenBannerTarget={handleOpenBannerTarget}
          />
        )}

        {(activeView === 'shop' ||
          activeView === 'racks-floor-stands' ||
          activeView === 'wall-systems-channels' ||
          activeView === 'mannequins-forms' ||
          activeView === 'luxury-gold-fixtures' ||
          activeView === 'hangers-accessories') && (
          <CatalogView
            setActiveView={navigateToView}
            onAddToCart={(prod, qty) => handleAddToCart(prod, qty || 1)}
            onToast={showToast}
            cartCount={cart.length}
            cartSubtotal={rawSubtotal}
            initialCategoryName={bannerCategoryName}
            initialProductId={bannerProductId}
            showAllProducts={activeView === 'shop'}
          />
        )}

        {activeView === 'pdp' && (
          <ProductDetailView
            onNavigate={navigateToView}
            onAddToCart={handleAddToCart}
            onOpenCad={() => setIsCadOpen(true)}
            onOpenReel={handleOpenReel}
          />
        )}

        {activeView === 'shop-setup-projects' && (
          <ProjectsView
            onNavigate={navigateToView}
            onOpenReel={handleOpenReel}
          />
        )}

        {activeView === 'quote-cart' && (
          <OrderListView
            onNavigate={navigateToView}
            cart={cart}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveFromCart}
            onOpenProforma={(details) => {
              setConsignee(details);
              setIsProformaOpen(true);
            }}
          />
        )}

        {activeView === 'custom-quote' && (
          <CustomQuoteView
            onNavigate={navigateToView}
            onAddToCart={handleAddToCart}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer setActiveView={navigateToView} />

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
