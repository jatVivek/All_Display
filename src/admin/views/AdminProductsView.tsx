import { AppIcon } from '../../components/AppIcon';
import React, { useState, useEffect } from 'react';
import { storeManager } from '../../services/storeManager';
import { Product } from '../../types';

interface AdminProductsViewProps {
  role: 'Owner' | 'Staff';
  setEditingProduct: (product: Product | 'new' | null) => void;
  showToast: (msg: string) => void;
}

export const AdminProductsView: React.FC<AdminProductsViewProps> = ({
  role,
  setEditingProduct,
  showToast
}) => {
  const [products, setProducts] = useState<Product[]>(() => storeManager.getProducts());
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setProducts(storeManager.getProducts());
    };
    window.addEventListener('alldisplay_catalog_updated', handleUpdate);
    window.addEventListener('alldisplay_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('alldisplay_catalog_updated', handleUpdate);
      window.removeEventListener('alldisplay_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStock = async (id: string) => {
    const updated = products.map(p => {
      if (p.id === id) {
        const nextStatus = p.stockStatus.includes('In Stock') ? 'Sold Out / Make to Order' : 'Sowcarpet In Stock';
        return { ...p, stockStatus: nextStatus };
      }
      return p;
    });
    setProducts(updated);
    if (await storeManager.saveProducts(updated)) {
      showToast('Product stock status saved.');
    } else {
      showToast('Stock status changed locally but could not sync to the shared database.');
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (role !== 'Owner') {
      showToast('Staff role cannot delete products. Switch to Owner mode.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete product "${title}"?`)) {
      if (await storeManager.deleteProduct(id)) {
        setProducts(storeManager.getProducts());
        showToast('Product deleted successfully!');
      } else {
        showToast('Product could not be deleted from the shared catalog.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AppIcon name="inventory_2" className="text-orange-600 text-[24px]" />
            <h1 className="text-2xl font-bold text-slate-900">Products &amp; Inventory</h1>
          </div>
          <p className="text-xs text-slate-500">
            Manage wholesale prices, stock availability, units, and jewellery display solutions.
          </p>
        </div>

        {role === 'Owner' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to clear all product and category data? This will empty the catalog for scratch testing.')) {
                  const productsCleared = await storeManager.clearProducts();
                  const categoriesCleared = productsCleared && await storeManager.saveCategories([]);
                  if (productsCleared && categoriesCleared) {
                    setProducts([]);
                    showToast('Products and categories cleared from the shared catalog.');
                  } else {
                    showToast('Catalog could not be fully cleared from the shared database.');
                  }
                }
              }}
              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <AppIcon name="delete_sweep" className="text-[18px]" />
              <span>Clear Catalog</span>
            </button>
            <button
              onClick={() => setEditingProduct('new')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <AppIcon name="add" className="text-[18px]" />
              <span>Add New Product</span>
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <AppIcon name="search" className="text-[18px]" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU code, category..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
          />
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline font-mono">
          Total Items: {filteredProducts.length}
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 pl-6">Product &amp; SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Wholesale Price</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProducts.map((prod) => {
                const isInStock = prod.stockStatus.includes('In Stock') || prod.stockStatus.includes('Stock');
                return (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 truncate max-w-xs">{prod.title}</span>
                        <span className="font-mono text-[10px] text-slate-500">{prod.code}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{prod.category}</td>
                    <td className="p-4 font-mono font-bold text-slate-900">
                      ₹{prod.price.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-slate-500">/ {prod.unit}</span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStock(prod.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer border ${
                          isInStock
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                      >
                        {prod.stockStatus}
                      </button>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        {role === 'Owner' && (
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.title)}
                            className="bg-red-50 hover:bg-red-100 text-red-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
