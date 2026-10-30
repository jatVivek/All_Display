import { AppIcon } from '../../components/AppIcon';
import React, { useState, useEffect, useMemo } from 'react';
import { storeManager, AdminCategory } from '../../services/storeManager';
import { compressImage } from '../../utils/imageCompressor';

interface AdminCategoriesViewProps {
  role: 'Owner' | 'Staff';
  showToast: (msg: string) => void;
}

export const AdminCategoriesView: React.FC<AdminCategoriesViewProps> = ({ role, showToast }) => {
  const [categories, setCategories] = useState<AdminCategory[]>(() => storeManager.getCategories());
  const [editingCat, setEditingCat] = useState<AdminCategory | 'new' | null>(null);
  
  // Form fields
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [parentCatId, setParentCatId] = useState<string>(''); // For level 2 parent OR level 3 root ancestor
  const [parentSubCatId, setParentSubCatId] = useState<string>(''); // For level 3 parent
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

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

  // Root categories (Level 1)
  const rootCategories = useMemo(() => {
    return categories.filter((c) => !c.parentId || (c.level || 1) === 1);
  }, [categories]);

  // Sub-categories (Level 2)
  const subCategories = useMemo(() => {
    return categories.filter((c) => c.level === 2);
  }, [categories]);

  // Child categories (Level 3)
  const childCategories = useMemo(() => {
    return categories.filter((c) => c.level === 3);
  }, [categories]);

  // Subcategories available under selected parentCatId in form
  const availableSubCategoriesForForm = useMemo(() => {
    if (!parentCatId) return [];
    return categories.filter((c) => c.level === 2 && c.parentId === parentCatId);
  }, [categories, parentCatId]);

  // Hierarchical list for display: Root -> Subcategories -> Child categories
  const hierarchicalCategories = useMemo(() => {
    const result: { item: AdminCategory; level: 1 | 2 | 3; parentName?: string; grandParentName?: string }[] = [];

    const query = searchFilter.toLowerCase().trim();

    rootCategories.forEach((root) => {
      const childrenOfRoot = subCategories.filter((sub) => sub.parentId === root.id);
      
      // Check if root or any descendant matches search
      const rootMatches = !query || root.name.toLowerCase().includes(query) || (root.description || '').toLowerCase().includes(query);
      const matchingSubs = childrenOfRoot.filter((sub) => {
        const subMatches = !query || sub.name.toLowerCase().includes(query) || (sub.description || '').toLowerCase().includes(query);
        const childrenOfSub = childCategories.filter((child) => child.parentId === sub.id);
        const childMatches = childrenOfSub.some((child) => !query || child.name.toLowerCase().includes(query));
        return subMatches || childMatches;
      });

      if (rootMatches || matchingSubs.length > 0) {
        result.push({ item: root, level: 1 });

        const subsToRender = query ? matchingSubs : childrenOfRoot;
        subsToRender.forEach((sub) => {
          result.push({ item: sub, level: 2, parentName: root.name });

          const grandChildren = childCategories.filter((child) => child.parentId === sub.id);
          const matchingChildren = grandChildren.filter((child) => !query || child.name.toLowerCase().includes(query));

          const childrenToRender = query ? matchingChildren : grandChildren;
          childrenToRender.forEach((child) => {
            result.push({ item: child, level: 3, parentName: sub.name, grandParentName: root.name });
          });
        });
      }
    });

    // Also include any orphan sub/child categories that don't have a valid parent
    const handledIds = new Set(result.map((r) => r.item.id));
    categories.forEach((cat) => {
      if (!handledIds.has(cat.id)) {
        if (!query || cat.name.toLowerCase().includes(query)) {
          result.push({ item: cat, level: cat.level || 1 });
        }
      }
    });

    return result;
  }, [rootCategories, subCategories, childCategories, categories, searchFilter]);

  const handleOpenCreate = (targetLevel: 1 | 2 | 3 = 1, parentId?: string, grandParentId?: string) => {
    setEditingCat('new');
    setLevel(targetLevel);
    setName('');
    setDescription('');
    setImage('');

    if (targetLevel === 1) {
      setParentCatId('');
      setParentSubCatId('');
    } else if (targetLevel === 2) {
      setParentCatId(parentId || rootCategories[0]?.id || '');
      setParentSubCatId('');
    } else if (targetLevel === 3) {
      const gParent = grandParentId || rootCategories[0]?.id || '';
      setParentCatId(gParent);
      const subsOfGParent = categories.filter((c) => c.level === 2 && c.parentId === gParent);
      setParentSubCatId(parentId || subsOfGParent[0]?.id || '');
    }
  };

  const handleOpenEdit = (cat: AdminCategory) => {
    setEditingCat(cat);
    const catLevel = cat.level || 1;
    setLevel(catLevel);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '');

    if (catLevel === 1) {
      setParentCatId('');
      setParentSubCatId('');
    } else if (catLevel === 2) {
      setParentCatId(cat.parentId || rootCategories[0]?.id || '');
      setParentSubCatId('');
    } else if (catLevel === 3) {
      const parentSub = categories.find((c) => c.id === cat.parentId);
      if (parentSub) {
        setParentCatId(parentSub.parentId || rootCategories[0]?.id || '');
        setParentSubCatId(parentSub.id);
      } else {
        setParentCatId(rootCategories[0]?.id || '');
        setParentSubCatId(cat.parentId || '');
      }
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 500, maxHeight: 500, quality: 0.82 });
      setImage(compressed);
      showToast('Image loaded and optimized successfully.');
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

    if (!name.trim()) {
      showToast('Please enter a category name.');
      return;
    }

    let resolvedParentId: string | null = null;
    if (level === 2) {
      if (!parentCatId) {
        showToast('Please select a parent Category for this Sub-Category.');
        return;
      }
      resolvedParentId = parentCatId;
    } else if (level === 3) {
      if (!parentSubCatId) {
        showToast('Please select a parent Sub-Category for this Child Category.');
        return;
      }
      resolvedParentId = parentSubCatId;
    }

    const now = new Date().toISOString();

    if (editingCat === 'new') {
      const newCat: AdminCategory = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        image: image.trim() || undefined,
        parentId: resolvedParentId,
        level,
        createdAt: now,
        updatedAt: now,
        sortOrder: 0,
      };
      const updated = [newCat, ...categories];
      if (!await storeManager.saveCategories(updated, true)) {
        showToast('Category could not be saved to the shared catalog.');
        return;
      }
      setCategories(updated);
      const levelLabel = level === 1 ? 'Category' : level === 2 ? 'Sub-Category' : 'Child Category';
      showToast(`New ${levelLabel} created successfully with image!`);
    } else if (editingCat && typeof editingCat === 'object') {
      const updated = categories.map((c) => (c.id === editingCat.id ? {
        ...c,
        name: name.trim(),
        description: description.trim(),
        image: image.trim() || undefined,
        parentId: resolvedParentId,
        level,
        updatedAt: now,
      } : c));

      if (!await storeManager.saveCategories(updated, true)) {
        showToast('Category could not be saved to the shared catalog.');
        return;
      }
      setCategories(updated);
      showToast('Category updated successfully!');
    }
    setEditingCat(null);
  };

  const handleDelete = async (id: string, catName: string, catLevel: 1 | 2 | 3 = 1) => {
    const levelLabel = catLevel === 1 ? 'Category' : catLevel === 2 ? 'Sub-Category' : 'Child Category';
    const warning = catLevel === 1 
      ? `Are you sure you want to delete ${levelLabel} "${catName}"? Any child sub-categories will also be deleted.`
      : `Are you sure you want to delete ${levelLabel} "${catName}"?`;

    if (window.confirm(warning)) {
      const idsToDelete = new Set<string>([id]);
      categories.forEach((c) => {
        if (c.parentId && idsToDelete.has(c.parentId)) idsToDelete.add(c.id);
      });
      categories.forEach((c) => {
        if (c.parentId && idsToDelete.has(c.parentId)) idsToDelete.add(c.id);
      });
      setCategories((prev) => prev.filter((c) => !idsToDelete.has(c.id)));

      const ok = await storeManager.deleteCategory(id);
      setCategories(storeManager.getCategories());
      if (ok) {
        showToast(`${levelLabel} "${catName}" deleted successfully!`);
      } else {
        showToast('Could not delete from the shared catalog.');
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
            <h1 className="text-2xl font-bold text-slate-900">Category Hierarchy Management</h1>
          </div>
          <p className="text-xs text-slate-500">
            Organize full 3-level taxonomy: Category → Sub-Category → Child Category with custom images and product counts.
          </p>
        </div>

        {role === 'Owner' && (
          <div className="flex flex-wrap items-center gap-2">
            {categories.length > 0 && (
              <button
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete all categories? This will clear all categories, sub-categories, and child categories.')) {
                    setCategories([]);
                    const ok = await storeManager.clearCategories();
                    if (ok) {
                      setCategories([]);
                      showToast('All categories have been cleared successfully!');
                    } else {
                      setCategories(storeManager.getCategories());
                      showToast('Could not clear categories from the shared catalog.');
                    }
                  }
                }}
                className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Clear all categories from the catalog"
              >
                <AppIcon name="delete_sweep" className="text-base" />
                <span>Clear Categories</span>
              </button>
            )}
            <button
              onClick={() => handleOpenCreate(1)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              title="Add Level 1 Main Category"
            >
              <AppIcon name="add" className="text-base" />
              <span>+ Category</span>
            </button>
            <button
              onClick={() => handleOpenCreate(2)}
              className="bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              title="Add Level 2 Sub-Category"
            >
              <AppIcon name="add" className="text-base" />
              <span>+ Sub-Category</span>
            </button>
            <button
              onClick={() => handleOpenCreate(3)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              title="Add Level 3 Child Category"
            >
              <AppIcon name="add" className="text-base" />
              <span>+ Child Category</span>
            </button>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-80 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <AppIcon name="search" className="text-slate-400 text-sm" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search categories, sub-categories..."
            className="w-full bg-transparent text-xs text-slate-900 outline-none"
          />
          {searchFilter && (
            <button onClick={() => setSearchFilter('')} className="text-slate-400 hover:text-slate-600">
              <AppIcon name="close" className="text-xs" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span>{rootCategories.length} Categories</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
            <span>{subCategories.length} Sub-Categories</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>{childCategories.length} Child Categories</span>
          </span>
        </div>
      </div>

      {/* Hierarchical Categories Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4 w-16">Image</th>
                <th className="py-3 px-4">Level &amp; Name</th>
                <th className="py-3 px-4">Hierarchy Path</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Active Products</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hierarchicalCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No categories found. Click "+ Category" to create one.
                  </td>
                </tr>
              ) : (
                hierarchicalCategories.map(({ item, level: itemLevel, parentName, grandParentName }) => {
                  // Active products matching this specific level
                  const count = itemLevel === 1
                    ? products.filter((p) => p.category?.toLowerCase() === item.name.toLowerCase()).length
                    : itemLevel === 2
                    ? products.filter((p) => p.subCategory?.toLowerCase() === item.name.toLowerCase()).length
                    : products.filter((p) => p.childCategory?.toLowerCase() === item.name.toLowerCase()).length;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        itemLevel === 1 ? 'bg-white font-medium' : itemLevel === 2 ? 'bg-slate-50/30' : 'bg-amber-50/20'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-white"
                          />
                        ) : (
                          <div
                            className={`w-10 h-10 rounded-lg border flex items-center justify-center font-bold text-xs ${
                              itemLevel === 1
                                ? 'bg-orange-50 border-orange-200 text-orange-600'
                                : itemLevel === 2
                                ? 'bg-slate-100 border-slate-300 text-slate-700'
                                : 'bg-amber-50 border-amber-200 text-amber-700'
                            }`}
                          >
                            {item.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </td>

                      {/* Level & Name with Indentation */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {itemLevel === 2 && (
                            <span className="text-slate-400 font-mono text-sm pl-2">↳</span>
                          )}
                          {itemLevel === 3 && (
                            <span className="text-amber-500 font-mono text-sm pl-6">↳↳</span>
                          )}

                          <span
                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              itemLevel === 1
                                ? 'bg-orange-100 text-orange-800'
                                : itemLevel === 2
                                ? 'bg-slate-800 text-white'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {itemLevel === 1 ? 'Category' : itemLevel === 2 ? 'Sub-Cat' : 'Child-Cat'}
                          </span>

                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {item.name}
                          </span>

                          {!['cat-1', 'cat-2', 'cat-3', 'cat-4', 'cat-5', 'cat-6', 'cat-7', 'cat-8', 'cat-9'].includes(item.id) &&
                            Boolean(item.createdAt) && (
                              <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-1.5 py-0.2 rounded shrink-0">
                                NEW
                              </span>
                            )}
                        </div>
                      </td>

                      {/* Hierarchy Path Breadcrumb */}
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {itemLevel === 1 && (
                          <span className="text-slate-400 italic">Root Level</span>
                        )}
                        {itemLevel === 2 && (
                          <span className="font-medium text-slate-700 flex items-center gap-1">
                            <span className="text-orange-600 font-bold">{parentName}</span>
                            <span>›</span>
                            <span>{item.name}</span>
                          </span>
                        )}
                        {itemLevel === 3 && (
                          <span className="font-medium text-slate-700 flex items-center gap-1">
                            <span className="text-orange-600 font-bold">{grandParentName}</span>
                            <span>›</span>
                            <span className="text-slate-700 font-bold">{parentName}</span>
                            <span>›</span>
                            <span className="text-amber-700">{item.name}</span>
                          </span>
                        )}
                      </td>

                      {/* Description */}
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {item.description || '—'}
                      </td>

                      {/* Active Products Count */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            count > 0
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {count} Products
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Add Child/Sub Button */}
                          {role === 'Owner' && itemLevel === 1 && (
                            <button
                              onClick={() => handleOpenCreate(2, item.id)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer"
                              title={`Add Sub-Category under "${item.name}"`}
                            >
                              + Sub-Cat
                            </button>
                          )}
                          {role === 'Owner' && itemLevel === 2 && (
                            <button
                              onClick={() => handleOpenCreate(3, item.id, item.parentId || undefined)}
                              className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer"
                              title={`Add Child Category under "${item.name}"`}
                            >
                              + Child-Cat
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Edit
                          </button>

                          {role === 'Owner' && (
                            <button
                              onClick={() => handleDelete(item.id, item.name, itemLevel)}
                              className="bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editingCat !== null && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 touch-none overscroll-none">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 overscroll-contain max-h-[92vh] overflow-y-auto">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <AppIcon name="category" className="text-orange-400 text-lg" />
                <h2 className="font-bold text-base">
                  {editingCat === 'new'
                    ? level === 1
                      ? 'Add New Category (Level 1)'
                      : level === 2
                      ? 'Add New Sub-Category (Level 2)'
                      : 'Add New Child Category (Level 3)'
                    : `Edit ${level === 1 ? 'Category' : level === 2 ? 'Sub-Category' : 'Child Category'}`}
                </h2>
              </div>
              <button onClick={() => setEditingCat(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <AppIcon name="close" className="text-[20px]" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              {/* Hierarchy Level Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800">Hierarchy Level *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLevel(1)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                      level === 1
                        ? 'bg-orange-50 border-orange-500 text-orange-700 ring-1 ring-orange-500'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    1. Category
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLevel(2);
                      if (!parentCatId && rootCategories.length > 0) {
                        setParentCatId(rootCategories[0].id);
                      }
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                      level === 2
                        ? 'bg-slate-800 border-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    2. Sub-Category
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLevel(3);
                      if (!parentCatId && rootCategories.length > 0) {
                        setParentCatId(rootCategories[0].id);
                      }
                      const subs = categories.filter((c) => c.level === 2);
                      if (!parentSubCatId && subs.length > 0) {
                        setParentSubCatId(subs[0].id);
                      }
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                      level === 3
                        ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    3. Child Category
                  </button>
                </div>
              </div>

              {/* Parent Category Selector for Level 2 and Level 3 */}
              {(level === 2 || level === 3) && (
                <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <span className="text-orange-600">●</span>
                    <span>Parent Category (Level 1) *</span>
                  </label>
                  <select
                    required
                    value={parentCatId}
                    onChange={(e) => {
                      setParentCatId(e.target.value);
                      // Reset subcat if level 3
                      const firstSub = categories.find((c) => c.level === 2 && c.parentId === e.target.value);
                      setParentSubCatId(firstSub ? firstSub.id : '');
                    }}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:border-orange-500"
                  >
                    <option value="" disabled>Select parent Category</option>
                    {rootCategories.map((root) => (
                      <option key={root.id} value={root.id}>
                        {root.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Parent Sub-Category Selector for Level 3 */}
              {level === 3 && (
                <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <span className="text-amber-600">●</span>
                    <span>Parent Sub-Category (Level 2) *</span>
                  </label>
                  <select
                    required
                    value={parentSubCatId}
                    onChange={(e) => setParentSubCatId(e.target.value)}
                    className="p-2.5 rounded-lg bg-white border border-amber-200 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500"
                  >
                    <option value="" disabled>
                      {availableSubCategoriesForForm.length === 0
                        ? 'No Sub-Categories available under this category (create one first)'
                        : 'Select parent Sub-Category'}
                    </option>
                    {availableSubCategoriesForForm.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Category / Sub-Category / Child Category Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800">
                  {level === 1 ? 'Category Name *' : level === 2 ? 'Sub-Category Name *' : 'Child Category Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    level === 1
                      ? 'e.g. Jewellery Display Stand'
                      : level === 2
                      ? 'e.g. Earring & Stud Stands'
                      : 'e.g. T-Bar Acrylic Earring Stand'
                  }
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-semibold"
                />
              </div>

              {/* Category Image Upload (Supports Category, Sub-Category, and Child Category) */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span>Image (Upload File or paste Image URL)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                </label>

                {image && (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 mb-1">
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
                    <AppIcon
                      name={isUploading ? 'progress_activity' : 'cloud_upload'}
                      className={`text-base ${isUploading ? 'animate-spin' : ''}`}
                    />
                    <span>{isUploading ? 'Optimizing…' : 'Upload Image File'}</span>
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

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of items under this category..."
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
                  className="bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
                >
                  Save {level === 1 ? 'Category' : level === 2 ? 'Sub-Category' : 'Child Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
