import { AppIcon } from '../../components/AppIcon';
import React, { useState, useEffect } from 'react';
import { storeManager, AdminCategory } from '../../services/storeManager';
import { compressImage } from '../../utils/imageCompressor';

interface AdminCategoriesViewProps {
  role: 'Owner' | 'Staff';
  showToast: (msg: string) => void;
}

export const AdminCategoriesView: React.FC<AdminCategoriesViewProps> = ({ role, showToast }) => {
  const [categories, setCategories] = useState<AdminCategory[]>(() => storeManager.getCategories());
  const [editingCat, setEditingCat] = useState<AdminCategory | 'new' | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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
      setDescription(cat.description || '');
      setImage(cat.image || '');
    } else {
      setEditingCat('new');
      setName('');
      setDescription('');
      setImage('');
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      // Issue #20: Compress client-side to prevent freeze and bandwidth bloat
      const compressed = await compressImage(file, { maxWidth: 500, maxHeight: 500, quality: 0.82 });
      setImage(compressed);
      showToast('Category image loaded & optimized.');
    } catch {
      showToast('Could not optimize image. Please select another file.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
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
        name: name.trim(),
        description: description.trim(),
        image: image.trim() || undefined,
      };
      const updated = [...categories, newCat];
      if (!await storeManager.saveCategories(updated)) {
        showToast('Category could not be saved to the shared catalog.');
        return;
      }
      setCategories(updated);
      showToast('New category created successfully with image!');
    } else if (editingCat && typeof editingCat === 'object') {
      const updated = categories.map(c => c.id === editingCat.id ? {
        ...c,
        name: name.trim(),
        description: description.trim(),
        image: image.trim() || undefined
      } : c);
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
            Create, edit, and organize product categories with custom thumbnail images displayed on storefront.
          </p>
        </div>

        {role === 'Owner' && (
          <button
            onClick={() => handleOpenEdit()}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <AppIcon name="add" className="text-[18px]" />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4 w-16">Image</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Active Products</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => {
                const count = products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length;
                return (
                  <tr key={cat.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-white"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center font-bold text-xs">
                          {cat.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {cat.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-md truncate">
                      {cat.description || 'No description provided'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        count > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {count} Products
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        {role === 'Owner' && (
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 touch-none overscroll-none">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 overscroll-contain max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between sticky top-0 z-10">
              <h2 className="font-bold text-base">
                {editingCat === 'new' ? 'Add New Category' : 'Edit Category'}
              </h2>
              <button onClick={() => setEditingCat(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <AppIcon name="close" className="text-[20px]" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jewellery Display Busts & Trays"
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
              </div>

              {/* Issue #12 & #25: Category Image Upload & Local Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-800">Category Image (File or URL)</label>
                
                {image && (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 mb-2">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <AppIcon name="close" className="text-sm" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <label className="px-3.5 py-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0">
                    <AppIcon name={isUploading ? 'progress_activity' : 'cloud_upload'} className={`text-base ${isUploading ? 'animate-spin' : ''}`} />
                    <span>{isUploading ? 'Compressing…' : 'Upload Local Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="sr-only"
                    />
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Or paste image URL (https://...)"
                    className="p-2.5 flex-1 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white font-mono"
                  />
                </div>
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
                  disabled={isUploading}
                  className="bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
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