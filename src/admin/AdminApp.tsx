import { AppIcon } from '../components/AppIcon';
import React, { useState, useEffect } from 'react';
import { AdminHeader } from './components/AdminHeader';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AdminOrdersView } from './views/AdminOrdersView';
import { AdminOrderDetailView } from './views/AdminOrderDetailView';
import { AdminQuotesView } from './views/AdminQuotesView';
import { AdminProductsView } from './views/AdminProductsView';
import { AdminProductEditorModal } from './views/AdminProductEditorModal';
import { AdminCategoriesView } from './views/AdminCategoriesView';
import { AdminHomepageView } from './views/AdminHomepageView';
import { AdminCustomersView } from './views/AdminCustomersView';
import { AdminMediaView } from './views/AdminMediaView';
import { AdminSettingsView } from './views/AdminSettingsView';
import { AdminTeamView } from './views/AdminTeamView';
import { storeManager, AdminOrder } from '../services/storeManager';
import { Product } from '../types';
import { AdminProgress, Spinner } from '../components/LoadingStates';

interface AdminAppProps {
  onExitAdmin: () => void;
}

export type AdminTab = 
  | 'dashboard' 
  | 'orders' 
  | 'order-detail' 
  | 'quotes' 
  | 'products' 
  | 'categories'
  | 'homepage' 
  | 'customers' 
  | 'media' 
  | 'settings' 
  | 'team';

export const AdminApp: React.FC<AdminAppProps> = ({ onExitAdmin }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Navigation & Role state
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [role, setRole] = useState<'Owner' | 'Staff'>('Staff');
  const [syncStatus, setSyncStatus] = useState(storeManager.getState().catalogSyncStatus);
  const [syncError, setSyncError] = useState(storeManager.getState().catalogSyncError);
  const [, setStoreVersion] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  // Product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null | 'new'>(null);

  // Onboarding tour state
  const [showTour, setShowTour] = useState<boolean>(() => {
    return localStorage.getItem('alldisplay_admin_tour_seen') === 'open';
  });
  const [tourStep, setTourStep] = useState(1);

  useEffect(() => storeManager.subscribe((state) => {
    setSyncStatus(state.catalogSyncStatus);
    setSyncError(state.catalogSyncError);
    setStoreVersion((version) => version + 1);
  }), []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    let active = true;
    const searchParams = new URLSearchParams(window.location.search);
    const pass = searchParams.get('admin_pass');
    const tabParam = searchParams.get('tab') as AdminTab | null;
    if (tabParam) {
      setActiveTab(tabParam);
    }

    if (pass) {
      storeManager.signInAdmin(pass)
        .then((adminRole) => {
          if (!active) return;
          setRole(adminRole);
          setIsAuthenticated(true);
        })
        .catch((error: Error) => {
          if (active) setLoginError(error.message);
        })
        .finally(() => {
          if (active) setIsCheckingSession(false);
        });
      return () => {
        active = false;
      };
    }

    storeManager.getAdminRole()
      .then((adminRole) => {
        if (!active) return;
        if (adminRole) {
          setRole(adminRole);
          setIsAuthenticated(true);
        }
      })
      .catch((error: Error) => {
        if (active) setLoginError(error.message);
      })
      .finally(() => {
        if (active) setIsCheckingSession(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const adminRole = await storeManager.signInAdmin(passwordInput);
      setRole(adminRole);
      setIsAuthenticated(true);
      showToast('Signed in to All Display Admin.');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Unable to sign in.');
    }
  };

  const handleLogout = async () => {
    try {
      await storeManager.signOutAdmin();
    } catch (error) {
      showToast(error instanceof Error ? `Sign-out failed: ${error.message}` : 'Sign-out failed.');
      return;
    }
    setIsAuthenticated(false);
    onExitAdmin();
  };

  // If not authenticated, render the server-side admin password login.
  if (!isAuthenticated) {
    if (isCheckingSession) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center gap-3 text-white" role="status" aria-live="polite">
          <Spinner label="Checking admin session" />
          <span>Checking admin session...</span>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-8 flex flex-col items-center animate-in fade-in duration-300">
          <div className="h-14 mb-4 flex items-center justify-center">
            <img
              src={storeManager.getSettings().logoUrl || '/assets/logo.png'}
              alt="All Display Admin"
              className="max-h-14 w-auto max-w-[200px] object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/logo.png';
              }}
            />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 text-center mb-1">
            All Display Admin
          </h1>
          <p className="text-xs text-slate-500 text-center mb-6">
            Sign in with your authorized admin password
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            {syncStatus === 'local' && (
              <div role="status" className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-900 flex items-start gap-2.5">
                <AppIcon name="cloud_off" className="text-blue-600 text-base shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-blue-950">Standalone Mode Active</span>
                  <span className="text-blue-800 text-[11px] leading-relaxed">
                    You can sign in now to manage products, banners, and settings. Cloud MySQL can be connected in Vercel settings whenever you are ready.
                  </span>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Admin password</label>
              <div className="relative flex items-center">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Default: Admin123456"
                  className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                  aria-label={showAdminPassword ? 'Hide password' : 'Show password'}
                >
                  <AppIcon name={showAdminPassword ? 'visibility_off' : 'visibility'} className="text-base" />
                </button>
              </div>
              {loginError && (
                <span role="alert" className="text-xs text-rose-600 text-center font-medium">
                  {loginError}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-orange-600 text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <AppIcon name="lock_open" className="text-[18px]" />
              <span>Sign In to Dashboard</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 w-full flex items-center justify-between text-xs">
            <button
              onClick={onExitAdmin}
              className="text-slate-500 hover:text-slate-900 font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <AppIcon name="arrow_back" className="text-[16px]" />
              <span>Back to Storefront</span>
            </button>
            <span className="text-[11px] font-mono text-slate-400">Server authenticated</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans select-none">
      <AdminProgress active={syncStatus === 'connecting'} label="Connecting to shared store data" />
      {/* Toast Notification - Issue #22: z-[9999] so never covered by modals */}
      {toast && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#1a1c20] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200 border border-[#ffdf98]/30">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping"></span>
          <span>{toast}</span>
        </div>
      )}

      {/* Onboarding Tour Modal */}
      {showTour && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 touch-none overscroll-none">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 overscroll-contain">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span className="font-bold text-base text-slate-900">Quick Tour for Store Owner ({tourStep}/3)</span>
              </div>
              <button
                onClick={() => {
                  setShowTour(false);
                  localStorage.setItem('alldisplay_admin_tour_seen', 'true');
                }}
                className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                Skip Tour
              </button>
            </div>

            {tourStep === 1 && (
              <div className="flex flex-col gap-3 py-2">
                <h3 className="font-bold text-sm text-slate-900">1. Customer Orders arrive instantly</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When customers submit items on your website, orders are logged directly into your shared database and forwarded to WhatsApp. You can review items, totals, and dispatch status in 1 click.
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-800">
                  👉 Check the 'Orders' tab to reply on WhatsApp with prefilled order proformas!
                </div>
              </div>
            )}

            {tourStep === 2 && (
              <div className="flex flex-col gap-3 py-2">
                <h3 className="font-bold text-sm text-slate-900">2. Manage Products &amp; Prices instantly</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Need to update jewellery display prices, upload photos, or toggle stock status when sold out at Sowcarpet godown? Go to the 'Products' tab to change prices, stock toggles, and multi-angle photos.
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-800">
                  ⚡ Updates reflect on your public customer website immediately.
                </div>
              </div>
            )}

            {tourStep === 3 && (
              <div className="flex flex-col gap-3 py-2">
                <h3 className="font-bold text-sm text-slate-900">3. Role Security &amp; Settings</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You are currently logged in with <span className="font-bold text-orange-600">Owner</span> privileges. You can configure your UPI ID, bank details, and primary WhatsApp destination number in 'Business Settings'.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">Step {tourStep} of 3</span>
              <div className="flex items-center gap-2">
                {tourStep < 3 ? (
                  <button
                    onClick={() => setTourStep(tourStep + 1)}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowTour(false);
                      localStorage.setItem('alldisplay_admin_tour_seen', 'true');
                      showToast('Tour completed! Welcome to All Display Admin.');
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Start Managing Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <AdminHeader
        activeTab={activeTab}
        role={role}
        syncStatus={syncStatus}
        onLogout={handleLogout}
        onOpenTour={() => { setTourStep(1); setShowTour(true); }}
        onExitAdmin={onExitAdmin}
      />

      {syncError && (
        <div role="alert" className="bg-red-50 text-red-800 border-b border-red-200 px-6 py-3 text-xs">
          Catalog sync failed: {syncError}. Changes may not be visible to other visitors.
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <AdminDashboardView
                setActiveTab={setActiveTab}
                setSelectedOrderId={setSelectedOrderId}
              />
            )}
            {activeTab === 'orders' && (
              <AdminOrdersView
                setActiveTab={setActiveTab}
                setSelectedOrderId={setSelectedOrderId}
                showToast={showToast}
              />
            )}
            {activeTab === 'order-detail' && (
              <AdminOrderDetailView
                orderId={selectedOrderId}
                setActiveTab={setActiveTab}
                showToast={showToast}
              />
            )}
            {activeTab === 'quotes' && (
              <AdminQuotesView showToast={showToast} />
            )}
            {activeTab === 'products' && (
              <AdminProductsView
                role={role}
                setEditingProduct={setEditingProduct}
                showToast={showToast}
              />
            )}
            {activeTab === 'categories' && (
              <AdminCategoriesView
                role={role}
                showToast={showToast}
              />
            )}
            {activeTab === 'homepage' && (
              <AdminHomepageView showToast={showToast} />
            )}
            {activeTab === 'customers' && (
              <AdminCustomersView />
            )}
            {activeTab === 'media' && (
              <AdminMediaView showToast={showToast} />
            )}
            {activeTab === 'settings' && (
              <AdminSettingsView role={role} showToast={showToast} />
            )}
            {activeTab === 'team' && (
              <AdminTeamView role={role} />
            )}
          </div>
        </main>
      </div>

      {/* Product Editor Modal */}
      {editingProduct !== null && (
        <AdminProductEditorModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onError={showToast}
          onSave={() => {
            setEditingProduct(null);
            showToast('Product updated successfully and synced with storefront!');
          }}
        />
      )}
    </div>
  );
};
