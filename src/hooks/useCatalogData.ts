import { useState, useEffect } from 'react';
import { storeManager, CentralStoreState, AdminSettings } from '../services/storeManager';
import { Product, AdminCategory, HomepageBanner } from '../types';

export interface UseCatalogDataReturn {
  products: Product[];
  categories: AdminCategory[];
  homepageBanners: HomepageBanner[];
  homepageDealProductIds: string[];
  settings: AdminSettings;
  isLoading: boolean;
  isInitialized: boolean;
  isError: boolean;
  error: string | null;
  retry: () => Promise<void>;
}

export function useCatalogData(): UseCatalogDataReturn {
  const [state, setState] = useState<CentralStoreState>(() => storeManager.getState());

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = storeManager.subscribe((nextState) => {
      if (isMounted) {
        setState(nextState);
      }
    });

    if (!state.isInitialized && !state.isLoading) {
      void storeManager.refreshCatalog(true);
    }

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return {
    products: state.products,
    categories: state.categories,
    homepageBanners: state.homepageBanners,
    homepageDealProductIds: state.homepageDealProductIds,
    settings: state.settings,
    isLoading: state.isLoading || (!state.isInitialized && !state.fetchError),
    isInitialized: state.isInitialized,
    isError: Boolean(state.fetchError),
    error: state.fetchError,
    retry: () => storeManager.refreshCatalog(true),
  };
}
