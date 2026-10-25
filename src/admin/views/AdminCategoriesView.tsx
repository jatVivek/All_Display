import React, { useState, useEffect } from 'react';
import { storeManager, AdminCategory } from '../../services/storeManager';

interface AdminCategoriesViewProps {
  role: 'Owner' | 'Staff';
  showToast: (msg: string) => void;
}

export const AdminCategoriesView: React.FC<AdminCategoriesViewProps> = ({ role, showToast }) => {
  const [categories, setCategories] = useState<AdminCategory[]>(() => storeManager.getCategories());
  const [editingCat, setEditingCat] = useState<AdminCategory | 'new' | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setCategories(storeManager.getCategories());
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

  const products = storeManager.getProducts();

  const handleOpenEdit = (cat?: AdminCategory) => {
    if (cat) {
      setEditingCat(cat);
      setName(cat.name);
      setDescription(cat.description);
    } else {
      setEditingCat('new');
      setName('');
      setDescription('');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== 'Owner') {
      showToast('Staff role cannot modify categories. Switch to Owner mode.');
      return;
    }

    if (editingCat === 'new') {
      const newCat: AdminCategory = {
        id: `cat-${Date.now()}`,
        name,
        description
      };
      const updated = [...categories, newCat];
      storeManager.saveCategories(updated);
      setCategories(updated);
      showToast('New category created successfully!');
    } else if (editingCat && typeof editingCat === 'object') {
      const updated = categories.map(c => c.id === editingCat.id ? { ...c, name, description } : c);
      storeManager.saveCategories(updated);
      setCategories(updated);
      showToast('Category updated successfully!');
    }
    setEditingCat(null);
  };

  const handleDelete = (id: string, catName: string) => {
    if (role !== 'Owner') {
      showToast('Staff role cannot delete categories. Switch to Owner mode.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      storeManager.deleteCategory(id);
      setCategories(storeManager.getCategories());
      showToast('Category deleted successfully!');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e6e2dc] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#775a00] text-[24px]">category</span>
            <h1 className="font-serif text-2xl font-bold text-[#1c1c18]">Store Categories Management</h1>
          </div>
          <p className="text-xs text-[#76777b]">
            Create and organize product categories for the storefront catalog and filtering system.
          </p>
        </div>

        {role === 'Owner' && (
          <button
            onClick={() => handleOpenEdit()}
            className="bg-[#1a1c20] hover:bg-black text-[#ffdf98] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add New Category</span>
          </button>
        )}
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-[#e6e2dc] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fdf9f3] text-[11px] font-bold text-[#775a00] uppercase tracking-wider border-b border-[#e6e2dc]">
                <th className="p-4 pl-6">Category Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Assigned Products</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6e2dc] text-xs">
              {categories.map((cat) => {
                const count = products.filter(p => p.category === cat.name).length;
                return (
                  <tr key={cat.id} className="hover:bg-[#fdf9f3]/60 transition-colors">
                    <td className="p-4 pl-6 font-bold text-[#1c1c18] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#775a00]">folder</span>
                      <span>{cat.name}</span>
                    </td>
                    <td className="p-4 text-[#45474b]">{cat.description}</td>
                    <td className="p-4">
                      <span className="bg-[#f1ede7] text-[#1c1c18] font-bold px-2.5 py-1 rounded-full text-[11px]">
                        {count} Products
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      {role === 'Owner' && (
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
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

      {/* Edit / Add Modal */}
      {editingCat !== null && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-[#e6e2dc] overflow-hidden flex flex-col">
            <div className="bg-[#1a1c20] text-white p-4 px-6 flex items-center justify-between">
              <h2 className="font-serif font-bold text-base">
                {editingCat === 'new' ? 'Add New Category' : 'Edit Category'}
              </h2>
              <button onClick={() => setEditingCat(null)} className="text-white/70 hover:text-white cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1c1c18]">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Floor Stands & Bumper Racks"
                  className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs focus:outline-none focus:border-[#775a00]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1c1c18]">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of fixtures in this category..."
                  className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs focus:outline-none focus:border-[#775a00] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCat(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#76777b] hover:bg-[#f1ede7] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1a1c20] hover:bg-black text-[#ffdf98] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
