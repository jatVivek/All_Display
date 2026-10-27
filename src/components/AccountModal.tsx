import React, { useState, useEffect } from 'react';
import { AppIcon } from './AppIcon';
import { useAuth } from '../auth/AuthContext';
import { storeManager } from '../services/storeManager';
import { useScrollLock } from '../hooks/useScrollLock';

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
  useScrollLock(isOpen && Boolean(user));
  const getStoredProfileVal = (key: string) => {
    if (typeof window === 'undefined') return '';
    if (user?.id) {
      const uVal = localStorage.getItem(`alldisplay_user_${key}_${user.id}`) || localStorage.getItem(`vinayak_user_${key}_${user.id}`);
      if (uVal) return uVal;
    }
    if (user?.email) {
      const eVal = localStorage.getItem(`alldisplay_user_${key}_${user.email}`) || localStorage.getItem(`vinayak_user_${key}_${user.email}`);
      if (eVal) return eVal;
    }
    return localStorage.getItem(`alldisplay_user_${key}`) || localStorage.getItem(`vinayak_user_${key}`) || '';
  };

  const [activeTab, setActiveTab] = useState<'orders' | 'address' | 'security'>('orders');
  const [savedPhone, setSavedPhone] = useState(() => getStoredProfileVal('phone') || user?.phone || '');
  const [savedAddress, setSavedAddress] = useState(() => getStoredProfileVal('address'));
  const [savedPincode, setSavedPincode] = useState(() => getStoredProfileVal('pincode'));
  const [savedStore, setSavedStore] = useState(() => getStoredProfileVal('store'));
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync profile fields whenever modal opens or user updates
  useEffect(() => {
    if (isOpen && user) {
      setSavedPhone(getStoredProfileVal('phone') || user.phone || '');
      setSavedAddress(getStoredProfileVal('address'));
      setSavedPincode(getStoredProfileVal('pincode'));
      setSavedStore(getStoredProfileVal('store'));
    }
  }, [isOpen, user]);

  // Security / Reset Password state (Issue #32)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  if (!isOpen || !user) return null;

  // Retrieve orders matching user email or general orders
  const allOrders = storeManager.getOrders();
  const userOrders = allOrders.filter(
    (o) => o.customerName.toLowerCase().includes(user.name.toLowerCase()) || allOrders.length <= 3
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = savedPhone.trim();
    const address = savedAddress.trim();
    const pincode = savedPincode.trim();
    const store = savedStore.trim();

    localStorage.setItem('alldisplay_user_phone', phone);
    localStorage.setItem('alldisplay_user_address', address);
    localStorage.setItem('alldisplay_user_pincode', pincode);
    localStorage.setItem('alldisplay_user_store', store);

    // Keep legacy fallback keys in sync
    localStorage.setItem('vinayak_user_phone', phone);
    localStorage.setItem('vinayak_user_address', address);
    localStorage.setItem('vinayak_user_pincode', pincode);
    localStorage.setItem('vinayak_user_store', store);

    // Save user-scoped keys if authenticated
    if (user?.id) {
      localStorage.setItem(`alldisplay_user_phone_${user.id}`, phone);
      localStorage.setItem(`alldisplay_user_address_${user.id}`, address);
      localStorage.setItem(`alldisplay_user_pincode_${user.id}`, pincode);
      localStorage.setItem(`alldisplay_user_store_${user.id}`, store);
    }
    if (user?.email) {
      localStorage.setItem(`alldisplay_user_phone_${user.email}`, phone);
      localStorage.setItem(`alldisplay_user_address_${user.email}`, address);
      localStorage.setItem(`alldisplay_user_pincode_${user.email}`, pincode);
      localStorage.setItem(`alldisplay_user_store_${user.email}`, store);
    }

    // Broadcast profile updates to active views (e.g. OrderListView checkout)
    window.dispatchEvent(new Event('alldisplay_profile_updated'));
    window.dispatchEvent(new Event('vinayak_user_profile_updated'));

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError('New password must contain at least one uppercase letter (A-Z).');
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setPasswordError('New password must contain at least one lowercase letter (a-z).');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setPasswordError('New password must contain at least one special character (e.g. !@#$%^&*).');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await storeManager.changePassword(currentPassword, newPassword);
      setPasswordSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Could not update password. Please check your current password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200 touch-none overscroll-none"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 overscroll-contain"
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
        <div className="flex border-b border-slate-100 px-6 bg-white gap-6 text-xs font-bold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
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
            className={`py-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'address'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AppIcon name="location_on" className="text-base" />
            <span>Saved Shipping Address</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'security'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AppIcon name="lock" className="text-base" />
            <span>Reset Password</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6" data-scrollable="true">
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
                    onClick={onNavigateToShop}
                    className="mt-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-colors cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">{order.orderNo}</span>
                          <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold">
                            {order.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">{order.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900">
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                        <p className="text-[10px] text-slate-500">{order.items.length} items</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-xs text-slate-700">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between py-0.5">
                          <span>
                            {item.quantity}x {item.title} ({item.finish})
                          </span>
                          <span className="font-mono text-slate-500">
                            ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.trackingNo && (
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Transport Docket / Tracking:</span>
                        <span className="font-mono font-bold text-orange-600">{order.trackingNo}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'address' && (
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 max-w-lg">
              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <AppIcon name="check_circle" className="text-base text-emerald-600" />
                  <span>Shipping preferences updated!</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800">Business / Store Trade Name</label>
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

          {activeTab === 'security' && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4 max-w-lg">
              {passwordSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <AppIcon name="check_circle" className="text-base text-emerald-600" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AppIcon name="error" className="text-base text-red-600" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800">Current Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="p-3 pr-10 w-full rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                  >
                    <AppIcon name={showCurrentPassword ? 'visibility_off' : 'visibility'} className="text-base" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800">
                  New Password <span className="text-[10px] text-slate-500 font-normal">(min 6 chars, uppercase, lowercase, special char)</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="p-3 pr-10 w-full rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                  >
                    <AppIcon name={showNewPassword ? 'visibility_off' : 'visibility'} className="text-base" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800">Confirm New Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="p-3 pr-10 w-full rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                    aria-label={showConfirmNewPassword ? 'Hide password' : 'Show password'}
                  >
                    <AppIcon name={showConfirmNewPassword ? 'visibility_off' : 'visibility'} className="text-base" />
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {isChangingPassword ? 'Updating Password…' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};