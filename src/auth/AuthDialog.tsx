import { AppIcon } from '../components/AppIcon';
import React, { FormEvent, useState } from 'react';
import { useAuth } from './AuthContext';

export const AuthDialog: React.FC = () => {
  const { isAuthDialogOpen, closeAuthDialog, login, signup, loginWithGoogle } = useAuth();
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
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1a1c20]/55 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeAuthDialog();
      }}
    >
      <section
        className="w-full max-w-md rounded-2xl border border-[#e6e2dc] bg-white p-6 shadow-2xl sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#775a00]">All Display account</p>
            <h2 id="auth-dialog-title" className="mt-1 font-serif text-2xl font-bold text-[#1c1c18]">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="mt-1 text-sm leading-6 text-[#76777b]">
              Sign in to keep your details and orders together.
            </p>
          </div>
          <button
            type="button"
            onClick={closeAuthDialog}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#76777b] transition-colors hover:bg-[#f1ede7] hover:text-[#1c1c18]"
            aria-label="Close sign in dialog"
          >
            <AppIcon name="close" className="text-[20px]" />
          </button>
        </div>

        <button
          type="button"
          onClick={loginWithGoogle}
          className="flex min-h-11 w-full items-center justify-center gap-3 rounded-xl border border-[#d8d1c6] bg-white px-4 py-2.5 text-sm font-semibold text-[#1c1c18] transition-colors hover:bg-[#fdf9f3]"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#d8d1c6] text-xs font-bold text-[#4285f4]">G</span>
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#a29a8d]">
          <span className="h-px flex-1 bg-[#e6e2dc]" />
          or email
          <span className="h-px flex-1 bg-[#e6e2dc]" />
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3.5">
          {mode === 'signup' && (
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#45474b]">
              Name
              <input
                autoComplete="name"
                required
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="min-h-11 rounded-xl border border-[#d8d1c6] px-3.5 text-sm font-normal outline-none focus:border-[#775a00] focus:ring-2 focus:ring-[#775a00]/10"
              />
            </label>
          )}
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#45474b]">
            Email
            <input
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-11 rounded-xl border border-[#d8d1c6] px-3.5 text-sm font-normal outline-none focus:border-[#775a00] focus:ring-2 focus:ring-[#775a00]/10"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#45474b]">
            Password
            <input
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              minLength={mode === 'signup' ? 12 : undefined}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-11 rounded-xl border border-[#d8d1c6] px-3.5 text-sm font-normal outline-none focus:border-[#775a00] focus:ring-2 focus:ring-[#775a00]/10"
            />
            {mode === 'signup' && <span className="text-[11px] font-normal text-[#76777b]">Use at least 12 characters.</span>}
          </label>
          {requestError && <p role="alert" className="text-xs leading-5 text-red-700">{requestError}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#1a1c20] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#775a00] disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#76777b]">
          {mode === 'login' ? 'New to All Display?' : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => {
              setRequestError(null);
              setMode(mode === 'login' ? 'signup' : 'login');
            }}
            className="font-bold text-[#775a00] hover:underline"
          >
            {mode === 'login' ? 'Create account' : 'Sign in'}
          </button>
        </p>
      </section>
    </div>
  );
};
