import { AppIcon } from '../components/AppIcon';
import React, { FormEvent, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useScrollLock } from '../hooks/useScrollLock';
import { storeManager, AdminSettings } from '../services/storeManager';

export const AuthDialog: React.FC = () => {
  const { isAuthDialogOpen, closeAuthDialog, login, signup } = useAuth();
  useScrollLock(isAuthDialogOpen);
  const [settings, setSettings] = useState<AdminSettings>(() => storeManager.getSettings());
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    return storeManager.subscribe((state) => {
      if (state.settings) {
        setSettings(state.settings);
      }
    });
  }, []);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthDialogOpen) return null;

  const validatePasswordComplexity = (pwd: string): string | null => {
    if (pwd.length < 6) return 'Password must be at least 6 characters long.';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter (A-Z).';
    if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter (a-z).';
    if (!/[^A-Za-z0-9]/.test(pwd)) return 'Password must contain at least one special character (e.g. !@#$%^&*).';
    return null;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setRequestError(null);

    if (mode === 'signup') {
      const complexityErr = validatePasswordComplexity(password);
      if (complexityErr) {
        setRequestError(complexityErr);
        return;
      }
      if (password !== confirmPassword) {
        setRequestError('Passwords do not match. Please ensure both fields are identical.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signup') await signup({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
      else await login({ email: email.trim(), password });
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Could not authenticate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200 touch-none overscroll-none"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeAuthDialog();
      }}
    >
      <section
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8 animate-in zoom-in-95 duration-200 overscroll-contain max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="h-11 mb-3 flex items-center">
              <img
                src={settings.logoUrl || '/assets/logo_alldisplay.svg'}
                alt={settings.brandName || 'All Display'}
                className="max-h-11 w-auto max-w-[160px] object-contain rounded-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/logo_alldisplay.svg';
                }}
              />
            </div>
            <h2 id="auth-dialog-title" className="text-xl sm:text-2xl font-bold text-slate-900">
              {mode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Track past wholesale orders, save delivery addresses, and sync with WhatsApp.
            </p>
          </div>
          <button
            type="button"
            onClick={closeAuthDialog}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Close sign in dialog"
          >
            <AppIcon name="close" className="text-[20px]" />
          </button>
        </div>

        {requestError && (
          <div role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            {requestError}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-3.5">
          {mode === 'signup' && (
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
              Contact / Proprietor Name
              <input
                autoComplete="name"
                required
                maxLength={100}
                placeholder="e.g. Suresh Kumar"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-normal text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </label>
          )}

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
            Email Address
            <input
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder="name@store.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-normal text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
          </label>

          {mode === 'signup' && (
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
              WhatsApp / Mobile Number <span className="text-[10px] text-slate-500 font-normal">(Optional, for order tracking & dispatch alerts)</span>
              <input
                type="tel"
                autoComplete="tel"
                maxLength={20}
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-normal text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </label>
          )}

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
            Password {mode === 'signup' && <span className="text-[10px] text-slate-500 font-normal">(min 6 chars, 1 uppercase, 1 lowercase, 1 special)</span>}
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                required
                minLength={6}
                maxLength={128}
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-3.5 pr-10 text-xs font-normal text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <AppIcon name={showPassword ? 'visibility_off' : 'visibility'} className="text-base" />
              </button>
            </div>
          </label>

          {mode === 'signup' && (
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
              Confirm Password
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  maxLength={128}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-3.5 pr-10 text-xs font-normal text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <AppIcon name={showConfirmPassword ? 'visibility_off' : 'visibility'} className="text-base" />
                </button>
              </div>
            </label>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 min-h-11 w-full rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Please wait…' : mode === 'login' ? 'Sign In to Account' : 'Create Account'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{mode === 'login' ? 'New customer?' : 'Already have an account?'}</span>
          <button
            type="button"
            onClick={() => {
              setRequestError(null);
              setMode(mode === 'login' ? 'signup' : 'login');
            }}
            className="font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
          >
            {mode === 'login' ? 'Create an account' : 'Sign in instead'}
          </button>
        </div>
      </section>
    </div>
  );
};
