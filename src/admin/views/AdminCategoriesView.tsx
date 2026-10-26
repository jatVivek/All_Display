import { AppIcon } from '../../components/AppIcon';
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

  const handleSave = async (e: React.FormEvent) => {
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
      if (!await storeManager.saveCategories(updated)) {
        showToast('Category could not be saved to the shared catalog.');
        return;
      }
      setCategories(updated);
      showToast('New category created successfully!');
    } else if (editingCat && typeof editingCat === 'object') {
      const updated = categories.map(c => c.id === editingCat.id ? { ...c, name, description } : c);
      if (!await storeManager.saveCategories(updated)) {
        showToast('Category could not be saved to the shared catalog.');
        return;
      }
      setCategories(updated);
      showToast('Category updated successfully!');
    }
    setEditingCat(null);
  };

  const handleDelete = async (id: string, catName: string) => {
    if (role !== 'Owner') {
      showToast('Staff role cannot delete categories. Switch to Owner mode.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      if (await storeManager.deleteCategory(id)) {
        setCategories(storeManager.getCategories());
        showToast('Category deleted successfully!');
      } else {
        showToast('Category could not be deleted from the shared catalog.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AppIcon name="category" className="text-orange-600 text-[24px]" />
            <h1 className="text-2xl font-bold text-slate-900">Categories Management</h1>
          </div>
          <p className="text-xs text-slate-500">
            Create and organize product categories for the storefront navigation, filter bar, and carousel.
          </p>
        </div>

        {role === 'Owner' && (
          <button
            onClick={() => handleOpenEdit()}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <AppIcon name="add" className="text-[18px]" />
            <span>Add New Category</span>
          </button>
        )}
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 pl-6">Category Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Assigned Products</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {categories.map((cat) => {
                const count = products.filter(p => p.category === cat.name).length;
                return (
                  <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-900 flex items-center gap-2">
                      <AppIcon name="folder" className="text-[18px] text-orange-600" />
                      <span>{cat.name}</span>
                    </td>
                    <td className="p-4 text-slate-600">{cat.description}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-full text-[11px]">
                        {count} Products
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
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
                      </div>
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <h2 className="font-bold text-base">
                {editingCat === 'new' ? 'Add New Category' : 'Edit Category'}
              </h2>
              <button onClick={() => setEditingCat(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <AppIcon name="close" className="text-[20px]" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jewellery Display Busts & Trays"
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of jewellery display items in this category..."
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCat(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
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
