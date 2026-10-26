import React, { useState } from 'react';
import { AppIcon } from './AppIcon';
import { useAuth } from '../auth/AuthContext';
import { storeManager } from '../services/storeManager';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToShop: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onNavigateToShop,
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'address'>('orders');
  const [savedPhone, setSavedPhone] = useState(() => localStorage.getItem('vinayak_user_phone') || '');
  const [savedAddress, setSavedAddress] = useState(() => localStorage.getItem('vinayak_user_address') || '');
  const [savedPincode, setSavedPincode] = useState(() => localStorage.getItem('vinayak_user_pincode') || '');
  const [savedStore, setSavedStore] = useState(() => localStorage.getItem('vinayak_user_store') || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen || !user) return null;

  // Retrieve orders matching user email or general orders
  const allOrders = storeManager.getOrders();
  const userOrders = allOrders.filter(
    (o) => o.customerName.toLowerCase().includes(user.name.toLowerCase()) || allOrders.length <= 3
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('vinayak_user_phone', savedPhone);
    localStorage.setItem('vinayak_user_address', savedAddress);
    localStorage.setItem('vinayak_user_pincode', savedPincode);
    localStorage.setItem('vinayak_user_store', savedStore);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Profile Card Header */}
        <div className="bg-gradient-to-r from-orange-50 via-amber-50/40 to-slate-50 p-6 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Verified Buyer
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={async () => {
                await logout();
                onClose();
              }}
              className="bg-white hover:bg-red-50 hover:text-red-600 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <AppIcon name="lock" className="text-sm" />
              <span>Sign Out</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <AppIcon name="close" className="text-lg" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 px-6 bg-white gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AppIcon name="shopping_bag" className="text-base" />
            <span>Order History ({userOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('address')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'address'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AppIcon name="location_on" className="text-base" />
            <span>Saved Shipping Address</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-4">
              {userOrders.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <AppIcon name="inventory_2" className="text-2xl" />
                  </div>
                  <h3 className="font-bold text-base text-slate-800">No past orders found</h3>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Orders submitted via your account and WhatsApp desk will appear here with live tracking status.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToShop();
                    }}
                    className="mt-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 hover:border-slate-300 transition-all bg-white"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{ord.orderNo}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{ord.date}</span>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        ord.status === 'New (Awaiting WhatsApp)' ? 'bg-amber-100 text-amber-800' :
                        ord.status === 'Payment pending' ? 'bg-orange-100 text-orange-800' :
                        ord.status === 'Packed' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 text-xs text-slate-600">
                      <p className="font-medium text-slate-800">
                        Destination: <span className="font-normal">{ord.destination} (Pincode: {ord.pincode})</span>
                      </p>
                      <p>
                        Items: {ord.items.map((i) => `${i.title} × ${i.quantity}`).join(', ')}
                      </p>
                      {ord.trackingNo && (
                        <p className="text-emerald-700 font-mono font-semibold">
                          📦 Tracking LR: {ord.trackingNo}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500">
                        {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                      </span>
                      <span className="font-mono font-extrabold text-base text-slate-900">
                        ₹{ord.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'address' && (
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 max-w-lg mx-auto">
              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <AppIcon name="check_circle" className="text-base text-emerald-600" />
                  <span>Shipping profile saved successfully!</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800">Store / Business Name</label>
                <input
                  type="text"
                  value={savedStore}
                  onChange={(e) => setSavedStore(e.target.value)}
                  placeholder="e.g. Kaveri Jewellery Studio"
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800">WhatsApp Contact Number</label>
                <input
                  type="tel"
                  value={savedPhone}
                  onChange={(e) => setSavedPhone(e.target.value)}
                  placeholder="919876543210"
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800">Delivery Address / Shop Location</label>
                <textarea
                  rows={3}
                  value={savedAddress}
                  onChange={(e) => setSavedAddress(e.target.value)}
                  placeholder="Street address, landmark, city, state"
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800">Pincode</label>
                <input
                  type="text"
                  value={savedPincode}
                  onChange={(e) => setSavedPincode(e.target.value)}
                  placeholder="600001"
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Address &amp; Details
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
