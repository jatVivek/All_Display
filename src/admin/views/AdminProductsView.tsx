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

  const handleToggleStock = (id: string) => {
    const updated = products.map(p => {
      if (p.id === id) {
        const nextStatus = p.stockStatus.includes('In Stock') ? 'Sold Out / Make to Order' : 'Ranigunj In Stock';
        return { ...p, stockStatus: nextStatus };
      }
      return p;
    });
    setProducts(updated);
    storeManager.saveProducts(updated);
    showToast('Product stock status toggled!');
  };

  const handleDeleteProduct = (id: string, title: string) => {
    if (role !== 'Owner') {
      showToast('Staff role cannot delete products. Switch to Owner mode.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete product "${title}"?`)) {
      storeManager.deleteProduct(id);
      setProducts(storeManager.getProducts());
      showToast('Product deleted successfully!');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e6e2dc] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#775a00] text-[24px]">inventory_2</span>
            <h1 className="font-serif text-2xl font-bold text-[#1c1c18]">Products &amp; Wholesale Inventory</h1>
          </div>
          <p className="text-xs text-[#76777b]">
            Manage ex-factory wholesale prices, stock availability, bulk price slabs, and store fixtures.
          </p>
        </div>

        {role === 'Owner' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all product and category data? This will empty the catalog for scratch testing.')) {
                  storeManager.clearProducts();
                  setProducts([]);
                  showToast('All products and category data cleared successfully!');
                }
              }}
              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
              <span>Clear Products &amp; Categories</span>
            </button>
            <button
              onClick={() => setEditingProduct('new')}
              className="bg-[#1a1c20] hover:bg-black text-[#ffdf98] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add New Wholesale Product</span>
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-4 border border-[#e6e2dc] shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#76777b]">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU code, category..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs text-[#1c1c18] focus:outline-none focus:border-[#775a00]"
          />
        </div>
        <span className="text-xs text-[#76777b] hidden sm:inline font-mono">
          Total Items: {filteredProducts.length}
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#e6e2dc] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fdf9f3] text-[11px] font-bold text-[#775a00] uppercase tracking-wider border-b border-[#e6e2dc]">
                <th className="p-4 pl-6">Product &amp; SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Ex-Factory Price</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e2dc] text-xs">
              {filteredProducts.map((prod) => {
                const isInStock = prod.stockStatus.includes('In Stock') || prod.stockStatus.includes('Stock');
                return (
                  <tr key={prod.id} className="hover:bg-[#fdf9f3]/60 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-10 h-10 rounded-xl object-cover border border-[#e6e2dc] bg-[#fdf9f3]"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1c1c18]">{prod.title}</span>
                        <span className="font-mono text-[10px] text-[#76777b]">{prod.code}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#45474b] font-medium">{prod.category}</td>
                    <td className="p-4 font-mono font-bold text-[#1c1c18]">
                      ₹{prod.price.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-[#76777b]">/ {prod.unit}</span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStock(prod.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                          isInStock
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {prod.stockStatus}
                      </button>
                    </td>
                    <td className="p-4 pr-6 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingProduct(prod)}
                        className="bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
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
