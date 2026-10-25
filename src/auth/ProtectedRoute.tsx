import { AppIcon } from '../components/AppIcon';
import React from 'react';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback,
}) => {
  const { user, isLoading, openAuthDialog } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-[#76777b]" role="status" aria-live="polite">
        <AppIcon name="progress_activity" className="animate-spin text-[#775a00]" />
        <span>Checking your account...</span>
      </div>
    );
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return fallback ?? (
      <section className="mx-auto my-10 max-w-lg rounded-2xl border border-[#e6e2dc] bg-white p-7 text-center shadow-sm">
        <AppIcon name="lock" className="text-3xl text-[#775a00]" />
        <h2 className="mt-3 font-serif text-xl font-bold text-[#1c1c18]">
          {user ? 'You do not have access to this page' : 'Sign in to continue'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#76777b]">
          {user ? 'This area is restricted to authorized accounts.' : 'Your account details will be available across the store.'}
        </p>
        {!user && (
          <button
            type="button"
            onClick={openAuthDialog}
            className="mt-5 min-h-11 rounded-xl bg-[#1a1c20] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#775a00]"
          >
            Sign in or create account
          </button>
        )}
      </section>
    );
  }

  return <>{children}</>;
};
