import React from 'react';
import { AppIcon } from './AppIcon';

export const CategoryCarouselSkeleton: React.FC = () => {
  return (
    <section className="rounded-2xl sm:rounded-3xl border border-slate-100 bg-slate-50/60 p-4 sm:p-6 shadow-2xs">
      <div className="flex items-center justify-between mb-2.5 sm:mb-4">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-orange-600">
            Explore By Category
          </span>
          <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
            Shop Categories
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200/70 animate-pulse" />
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200/70 animate-pulse" />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto pb-3 pt-3 px-2 scrollbar-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 shrink-0 min-w-[75px] sm:min-w-[110px] animate-pulse"
          >
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-slate-200/80 p-1 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-100" />
            </div>
            <div className="h-3 w-16 bg-slate-200/80 rounded-full" />
            <div className="h-2 w-10 bg-slate-100 rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
};

interface ProductGridSkeletonProps {
  count?: number;
  columns?: 3 | 4;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 8,
  columns = 4,
}) => {
  const gridClass =
    columns === 4
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';

  return (
    <div className={`grid ${gridClass} gap-2.5 sm:gap-4`}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-100 shadow-2xs flex flex-col gap-2.5 animate-pulse"
        >
          {/* Square Image Box */}
          <div className="relative w-full aspect-square rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center">
            <div className="w-8 h-8 rounded-lg bg-slate-200/70" />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-2.5 w-16 bg-slate-200/70 rounded-full" />
            <div className="h-3.5 w-3/4 bg-slate-200 rounded-md" />
            <div className="h-3.5 w-1/2 bg-slate-100 rounded-md" />

            {/* Price Line */}
            <div className="mt-auto pt-2 flex items-baseline gap-2">
              <div className="h-4 w-16 bg-slate-200 rounded-md" />
              <div className="h-3 w-10 bg-slate-100 rounded-md" />
            </div>
          </div>

          {/* Action Button */}
          <div className="h-8 w-full bg-slate-100 rounded-xl mt-1" />
        </div>
      ))}
    </div>
  );
};

export const CategorySidebarSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 animate-pulse">
      <div className="h-4 w-24 bg-slate-200 rounded-md mb-2" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-2 py-1">
          <div className="w-3.5 h-3.5 rounded bg-slate-200/80" />
          <div className="h-3.5 w-3/4 bg-slate-200/70 rounded-md" />
        </div>
      ))}
    </div>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-3 w-48 bg-slate-200 rounded-full mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Gallery */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-square rounded-3xl bg-slate-100 border border-slate-200/60" />
          <div className="flex items-center gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200/60" />
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col gap-4">
          <div className="h-3 w-20 bg-orange-200 rounded-full" />
          <div className="h-7 w-3/4 bg-slate-200 rounded-lg" />
          <div className="h-4 w-32 bg-slate-100 rounded-md" />
          
          <div className="h-8 w-40 bg-slate-200 rounded-lg mt-2" />

          <div className="h-px bg-slate-100 my-2" />

          <div className="flex flex-col gap-2">
            <div className="h-3 w-24 bg-slate-200 rounded-full" />
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 w-20 bg-slate-100 rounded-xl" />
              ))}
            </div>
          </div>

          <div className="h-12 w-full bg-slate-200 rounded-2xl mt-6" />
        </div>
      </div>
    </div>
  );
};

interface CatalogErrorStateProps {
  message?: string | null;
  onRetry: () => void;
}

export const CatalogErrorState: React.FC<CatalogErrorStateProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-rose-200 bg-rose-50/60 p-6 sm:p-10 text-center flex flex-col items-center justify-center gap-3 shadow-2xs">
      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
        <AppIcon name="cloud_off" className="text-2xl" />
      </div>
      <div className="flex flex-col gap-1 max-w-md">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
          Unable to load live catalog
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          {message || 'A network error occurred while fetching live products from the server. Please check your connection and retry.'}
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
      >
        <AppIcon name="refresh" className="text-sm" />
        <span>Retry Connection</span>
      </button>
    </div>
  );
};

interface CatalogEmptyStateProps {
  title?: string;
  description?: string;
}

export const CatalogEmptyState: React.FC<CatalogEmptyStateProps> = ({
  title = 'No Products in Catalog',
  description = 'There are currently no products available in the catalog.',
}) => {
  return (
    <div className="bg-slate-50/70 border border-slate-100 rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-2">
      <AppIcon name="inventory_2" className="text-3xl text-slate-400" />
      <h3 className="font-bold text-sm text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm">{description}</p>
    </div>
  );
};
