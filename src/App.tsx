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
import { ContactView } from './views/ContactView';
import { DealsView } from './views/DealsView';
import { storeManager } from './services/storeManager';
import { useAuth } from './auth/AuthContext';
import { AuthDialog } from './auth/AuthDialog';
import { WishlistModal } from './components/WishlistModal';
import { AccountModal } from './components/AccountModal';

const viewPaths: Record<ActiveView, string> = {
  home: '/',
  shop: '/shop',
  deals: '/deals',
  contact: '/contact-us',
  about: '/about-us',
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
  account: '/account',
};

const defaultCategories: Partial<Record<ActiveView, string>> = {
  'racks-floor-stands': 'Display Stand',
  'wall-systems-channels': 'Display Tray',
  'mannequins-forms': 'Display Bust',
  'luxury-gold-fixtures': 'Bangle & Bracelet Display Stand',
  'hangers-accessories': 'Packaging Tools',
};

const getRouteFromLocation = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const viewParam = searchParams.get('view') as ActiveView | null;
  if (viewParam) {
    return { view: viewParam, section: null, path: window.location.pathname };
  }
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path.startsWith('/products/')) {
    return { view: 'pdp' as ActiveView, section: null, path };
  }
  const section = path === '/about-us' ? 'about-us' : null;
  const view = (Object.entries(viewPaths).find(([, routePath]) => routePath === path)?.[0] ?? 'home') as ActiveView;
  return { view, section, path };
};

export default function App() {
  const { user, openAuthDialog } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>(() => (
    window.location.hash === '#admin' ? 'admin' : getRouteFromLocation().view
  ));
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      localStorage.removeItem('vinayak_cart');
      localStorage.removeItem('alldisplay_cart');
      const savedCart = localStorage.getItem('alldisplay_cart_v3');
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
  const [isWishlistOpen, setIsWishlistOpen] = useState(() => (
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('wishlist') === '1'
  ));
  const [isAccountOpen, setIsAccountOpen] = useState(() => (
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('account') === '1'
  ));
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path.startsWith('/products/')) {
      const slug = path.replace('/products/', '').toLowerCase();
      const match = storeManager.getProducts().find((p) => p.code.toLowerCase() === slug || p.id.toLowerCase() === slug);
      if (match) return match;
    }
    return storeManager.getProducts()[0] || null;
  });
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
    } else if (!route.section && !route.path.startsWith('/products/') && route.path !== viewPaths[route.view]) {
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
    if (sectionId === 'contact-us') {
      navigateToView('contact');
      return;
    }
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

  const navigateToShop = (category = 'All Categories') => {
    setBannerCategoryName(category);
    setBannerProductId(null);
    navigateToView('shop', category !== 'All Categories' ? `/shop?category=${encodeURIComponent(category)}` : '/shop');
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    navigateToView('pdp', `/products/${encodeURIComponent(product.code.toLowerCase())}`);
  };

  useEffect(() => {
    if (window.location.pathname.startsWith('/products/')) {
      const slug = window.location.pathname.replace('/products/', '').toLowerCase();
      const match = storeManager.getProducts().find((p) => p.code.toLowerCase() === slug || p.id.toLowerCase() === slug);
      if (match) setSelectedProduct(match);
    }
  }, [activeView]);

  useEffect(() => {
    if (activeView === 'account') {
      setIsAccountOpen(true);
    }
  }, [activeView]);

  useEffect(() => storeManager.subscribe(() => {
    setStoreVersion((version) => version + 1);
  }), []);

  useEffect(() => {
    try {
      localStorage.setItem('alldisplay_cart_v3', JSON.stringify(cart));
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
    setBannerProductId(banner.linkType === 'product' && banner.linkId ? banner.linkId : null);
    const view = categoryViews[categoryName || ''] || 'racks-floor-stands';
    const params = new URLSearchParams();
    if (categoryName) params.set('category', categoryName);
    if (banner.linkType === 'product' && banner.linkId) params.set('product', banner.linkId);
    navigateToView(view, `${viewPaths[view]}?${params.toString()}`);
  };

  const rawSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  if (activeView === 'admin') {
    return <AdminApp onExitAdmin={() => navigateToView('home')} />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-orange-100 selection:text-orange-900 antialiased">
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
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onSelectProduct={handleSelectProduct}
      />
      <AuthDialog />

      {/* Main Screen Router */}
      <main className="flex-1 w-full pt-18 sm:pt-20 xl:pt-36">
        {activeView === 'home' && (
          <HomeView
            setActiveView={navigateToView}
            onAddToCart={(prod, qty) => handleAddToCart(prod, qty || 1)}
            onSelectProduct={handleSelectProduct}
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
            onSelectProduct={handleSelectProduct}
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
            product={selectedProduct}
            onNavigate={navigateToView}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
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
            onClearCart={() => setCart([])}
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

        {activeView === 'contact' && (
          <ContactView
            setActiveView={navigateToView}
            onToast={showToast}
          />
        )}

        {activeView === 'deals' && (
          <DealsView
            setActiveView={navigateToView}
            onAddToCart={(prod, qty) => handleAddToCart(prod, qty || 1)}
            onSelectProduct={handleSelectProduct}
            onToast={showToast}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        setActiveView={navigateToView}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={() => {
          if (user) {
            setIsAccountOpen(true);
          } else {
            openAuthDialog();
          }
        }}
      />

      {/* Wishlist Modal Drawer */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onAddToCart={(prod) => handleAddToCart(prod, 1)}
        onSelectProduct={(p) => {
          setIsWishlistOpen(false);
          handleSelectProduct(p);
        }}
        onNavigateToProduct={(p) => {
          setIsWishlistOpen(false);
          handleSelectProduct(p);
        }}
      />

      {/* Customer Account & Order History Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onNavigateToShop={() => {
          setIsAccountOpen(false);
          navigateToView('shop');
        }}
      />

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
