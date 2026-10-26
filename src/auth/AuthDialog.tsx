import { AppIcon } from '../components/AppIcon';
import React, { FormEvent, useState } from 'react';
import { useAuth } from './AuthContext';

export const AuthDialog: React.FC = () => {
  const { isAuthDialogOpen, closeAuthDialog, login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthDialogOpen) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setRequestError(null);
    setIsSubmitting(true);
    try {
      if (mode === 'signup') await signup({ name: name.trim(), email: email.trim(), password });
      else await login({ email: email.trim(), password });
      setPassword('');
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Could not authenticate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeAuthDialog();
      }}
    >
      <section
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-extrabold text-base mb-3 shadow-xs">
              VP
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

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
            Password
            <input
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              required
              minLength={6}
              maxLength={128}
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-normal text-slate-900 outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
          </label>

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
