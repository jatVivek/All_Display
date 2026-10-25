import React from 'react';
import './LoadingStates.css';

interface SpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  label = 'Loading',
  size = 'md',
  className = '',
}) => (
  <span className={`loader-spinner loader-spinner--${size} ${className}`} role="status" aria-live="polite">
    <span className="loader-sr-only">{label}</span>
  </span>
);

interface FullPageLoaderProps {
  label?: string;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  label = 'Loading page',
}) => (
  <div className="loader-overlay" role="status" aria-live="polite">
    <Spinner label={label} size="lg" />
    <span className="loader-overlay__label" aria-hidden="true">{label}</span>
  </div>
);

interface AdminProgressProps {
  active: boolean;
  label?: string;
}

export const AdminProgress: React.FC<AdminProgressProps> = ({
  active,
  label = 'Loading dashboard data',
}) => active ? (
  <div className="admin-progress" role="status" aria-live="polite" aria-label={label}>
    <span className="admin-progress__bar" />
    <span className="loader-sr-only">{label}</span>
  </div>
) : null;

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <span className={`loader-skeleton ${className}`} aria-hidden="true" />
);

export const MetricCardSkeleton: React.FC = () => (
  <div className="loader-card-skeleton" role="status" aria-live="polite" aria-label="Loading metric">
    <span className="loader-sr-only">Loading metric</span>
    <Skeleton className="loader-skeleton--label" />
    <Skeleton className="loader-skeleton--metric" />
    <Skeleton className="loader-skeleton--detail" />
  </div>
);

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
}) => (
  <div className="loader-table-skeleton" role="status" aria-live="polite" aria-label="Loading table">
    <span className="loader-sr-only">Loading table</span>
    {Array.from({ length: rows }, (_, row) => (
      <div
        className="loader-table-skeleton__row"
        key={row}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }, (_, column) => (
          <Skeleton
            className={column === 0 ? 'loader-skeleton--table-primary' : 'loader-skeleton--table-cell'}
            key={column}
          />
        ))}
      </div>
    ))}
  </div>
);

export const FormSkeleton: React.FC = () => (
  <div className="loader-form-skeleton" role="status" aria-live="polite" aria-label="Loading form">
    <span className="loader-sr-only">Loading form</span>
    {[0, 1, 2].map((field) => (
      <div className="loader-form-skeleton__field" key={field}>
        <Skeleton className="loader-skeleton--label" />
        <Skeleton className="loader-skeleton--input" />
      </div>
    ))}
  </div>
);

interface ButtonLoadingProps {
  loading: boolean;
  children: React.ReactNode;
  loadingLabel?: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const LoadingButton: React.FC<ButtonLoadingProps> = ({
  loading,
  children,
  loadingLabel = 'Loading',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
}) => (
  <button
    type={type}
    className={className}
    disabled={disabled || loading}
    aria-busy={loading}
    onClick={onClick}
  >
    {loading && <Spinner label={loadingLabel} size="sm" />}
    <span>{loading ? loadingLabel : children}</span>
  </button>
);
