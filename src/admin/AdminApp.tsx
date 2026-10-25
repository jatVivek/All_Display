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
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('alldisplay_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Navigation & Role state
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('ord-1');
  const [role, setRole] = useState<'Owner' | 'Staff'>('Owner');
  const [toast, setToast] = useState<string | null>(null);

  // Product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null | 'new'>(null);

  // Onboarding tour state
  const [showTour, setShowTour] = useState<boolean>(() => {
    return localStorage.getItem('alldisplay_admin_tour_seen') !== 'true';
  });
  const [tourStep, setTourStep] = useState(1);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '123456') {
      setIsAuthenticated(true);
      localStorage.setItem('alldisplay_admin_auth', 'true');
      showToast('Welcome to All Display Admin Panel! PIN Verified.');
    } else {
      setPinError(true);
      setPinInput('');
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('alldisplay_admin_auth');
    onExitAdmin();
  };

  // If not authenticated, render PIN Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1a1c20] flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden border border-[#e6e2dc] p-8 flex flex-col items-center animate-in fade-in duration-300">
          <div className="w-14 h-14 rounded-2xl bg-[#1a1c20] text-[#ffdf98] flex items-center justify-center font-serif font-bold text-2xl mb-4 shadow-md">
            AD
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#1c1c18] text-center mb-1">
            All Display Wholesale Admin
          </h1>
          <p className="text-xs text-[#76777b] text-center mb-6">
            Ranigunj &amp; Begum Bazaar Showrooms Management Portal
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1c1c18] flex items-center justify-between">
                <span>Enter 6-Digit Owner PIN</span>
                <span className="text-[11px] text-[#76777b] font-mono">Hint: 123456</span>
              </label>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••"
                autoFocus
                className={`w-full px-4 py-3 rounded-xl bg-[#fdf9f3] border text-center font-mono text-xl tracking-widest outline-none transition-colors ${
                  pinError ? 'border-red-500 bg-red-50 text-red-600' : 'border-[#e6e2dc] focus:border-[#775a00]'
                }`}
              />
              {pinError && (
                <span className="text-xs text-red-600 text-center font-medium animate-bounce">
                  Incorrect PIN! Use default owner PIN: 123456
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#1a1c20] hover:bg-black text-[#ffdf98] py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">lock_open</span>
              <span>Authenticate &amp; Open Dashboard</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#e6e2dc] w-full flex items-center justify-between text-xs">
            <button
              onClick={onExitAdmin}
              className="text-[#76777b] hover:text-[#1c1c18] font-medium flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Storefront</span>
            </button>
            <span className="text-[11px] font-mono text-[#76777b]">v2.4 Secure Portal</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-[#1c1c18] flex flex-col font-sans select-none">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#1a1c20] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200 border border-[#ffdf98]/30">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping"></span>
          <span>{toast}</span>
        </div>
      )}

      {/* Onboarding Tour Modal */}
      {showTour && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-[#e6e2dc] flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#e6e2dc] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ffdf98]"></span>
                <span className="font-serif font-bold text-base">Quick Tour for Shop Owner ({tourStep}/3)</span>
              </div>
              <button
                onClick={() => {
                  setShowTour(false);
                  localStorage.setItem('alldisplay_admin_tour_seen', 'true');
                }}
                className="text-gray-400 hover:text-gray-600 text-xs"
              >
                Skip Tour
              </button>
            </div>

            {tourStep === 1 && (
              <div className="flex flex-col gap-3 py-2">
                <h3 className="font-bold text-sm text-[#1c1c18]">1. WhatsApp Orders arrive instantly</h3>
                <p className="text-xs text-[#45474b] leading-relaxed">
                  When customers click 'Order List' on your website, orders are formatted for WhatsApp and logged here automatically. You can review items, totals, and dispatch status in 1 click.
                </p>
                <div className="bg-[#fdf9f3] p-3 rounded-xl border border-[#e6e2dc] text-xs font-mono">
                  👉 Check 'Orders' tab to reply on WhatsApp with prefilled proforma in 1 click!
                </div>
              </div>
            )}

            {tourStep === 2 && (
              <div className="flex flex-col gap-3 py-2">
                <h3 className="font-bold text-sm text-[#1c1c18]">2. Manage Products &amp; Prices instantly</h3>
                <p className="text-xs text-[#45474b] leading-relaxed">
                  Need to update pipe rack prices or toggle stock status when sold out at Ranigunj godown? Go to the 'Products' tab to change prices, stock toggles, and bulk price slabs.
                </p>
                <div className="bg-[#fdf9f3] p-3 rounded-xl border border-[#e6e2dc] text-xs font-mono">
                  ⚡ Updates reflect on your public customer website immediately.
                </div>
              </div>
            )}

            {tourStep === 3 && (
              <div className="flex flex-col gap-3 py-2">
                <h3 className="font-bold text-sm text-[#1c1c18]">3. Role Security &amp; Settings</h3>
                <p className="text-xs text-[#45474b] leading-relaxed">
                  You are currently logged in as <span className="font-bold text-[#775a00]">Owner</span>. You can switch to Staff mode in the top bar to restrict pricing edits, and configure your UPI ID &amp; WhatsApp number in 'Settings'.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-[#e6e2dc]">
              <span className="text-[11px] text-[#76777b]">Step {tourStep} of 3</span>
              <div className="flex items-center gap-2">
                {tourStep < 3 ? (
                  <button
                    onClick={() => setTourStep(tourStep + 1)}
                    className="bg-[#1a1c20] text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowTour(false);
                      localStorage.setItem('alldisplay_admin_tour_seen', 'true');
                      showToast('Tour completed! Enjoy managing your wholesale store.');
                    }}
                    className="bg-[#25D366] text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
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
        setRole={setRole}
        onLogout={handleLogout}
        onOpenTour={() => { setTourStep(1); setShowTour(true); }}
        onExitAdmin={onExitAdmin}
      />

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
              <AdminTeamView role={role} setRole={setRole} showToast={showToast} />
            )}
          </div>
        </main>
      </div>

      {/* Product Editor Modal */}
      {editingProduct !== null && (
        <AdminProductEditorModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={() => {
            setEditingProduct(null);
            showToast('Product updated successfully and synced with storefront!');
          }}
        />
      )}
    </div>
  );
};
