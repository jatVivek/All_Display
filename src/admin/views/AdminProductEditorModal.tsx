import { AppIcon } from '../../components/AppIcon';
import React, { useState } from 'react';
import { Product, ProductVariation, ProductVariationOption } from '../../types';
import { storeManager } from '../../services/storeManager';
import { useScrollLock } from '../../hooks/useScrollLock';
import { compressImage } from '../../utils/imageCompressor';

interface AdminProductEditorModalProps {
  product: Product | 'new';
  onClose: () => void;
  onSave: () => void;
  onError: (message: string) => void;
}

const ALL_REQUIREMENTS = [
  { id: 'online-sellers', label: 'Online Sellers' },
  { id: 'instagram-shop', label: 'Instagram Shop' },
  { id: 'new-jewellery', label: 'New Jewellery Sellers' },
  { id: 'retail-shops', label: 'Retail Shops' },
];

export const AdminProductEditorModal: React.FC<AdminProductEditorModalProps> = ({
  product,
  onClose,
  onSave,
  onError
}) => {
  useScrollLock(Boolean(product));
  const isNew = product === 'new';
  const [modalError, setModalError] = useState<string | null>(null);
  const [title, setTitle] = useState(isNew ? '' : product.title);
  const [code, setCode] = useState(isNew ? 'AD-NEW-001' : product.code);

  const allCategories = storeManager.getCategories();
  const rootCategories = allCategories.filter((c) => !c.parentId || (c.level || 1) === 1);

  const [category, setCategory] = useState(isNew ? (rootCategories[0]?.name ?? '') : product.category);
  const [subCategory, setSubCategory] = useState(isNew ? '' : (product.subCategory || ''));
  const [childCategory, setChildCategory] = useState(isNew ? '' : (product.childCategory || ''));

  // Sub-categories under currently selected Category
  const matchingRootCat = rootCategories.find((c) => c.name.toLowerCase() === category.toLowerCase());
  const availableSubCategories = allCategories.filter(
    (c) => c.level === 2 && (matchingRootCat ? c.parentId === matchingRootCat.id : true)
  );

  // Child categories under currently selected Sub-Category
  const matchingSubCat = availableSubCategories.find((c) => c.name.toLowerCase() === subCategory.toLowerCase());
  const availableChildCategories = allCategories.filter(
    (c) => c.level === 3 && (matchingSubCat ? c.parentId === matchingSubCat.id : true)
  );

  const [price, setPrice] = useState(isNew ? 450 : product.price);
  const [originalPrice, setOriginalPrice] = useState(isNew ? 550 : (product.originalPrice || Math.round(product.price * 1.25)));
  const [unit, setUnit] = useState(isNew ? 'piece' : product.unit);
  const [moq, setMoq] = useState(isNew ? 'MOQ: 1 Pack' : product.moq);
  
  const initialImages = isNew
    ? []
    : (product.images && product.images.length > 0 ? product.images : product.image ? [product.image] : []);

  const [images, setImages] = useState<string[]>(initialImages);
  const [newImgInput, setNewImgInput] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [videoUrl, setVideoUrl] = useState(isNew ? '' : product.videoUrl ?? '');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const [material, setMaterial] = useState(isNew ? 'Velvet' : (product.material || 'Velvet'));
  const [finish, setFinish] = useState(isNew ? 'Velvet / Acrylic' : product.finish);
  const [stockStatus, setStockStatus] = useState(isNew ? 'Feel Khana In Stock' : product.stockStatus);
  const [dispatchReadiness, setDispatchReadiness] = useState(isNew ? 'Same-Day Dispatch from Feel Khana, Hyderabad' : (product.dispatchReadiness || 'Ready Stock'));

  // Requirements (multiple)
  const [requirements, setRequirements] = useState<string[]>(isNew ? ['online-sellers', 'retail-shops'] : (product.requirements || []));

  // Variations
  const [variations, setVariations] = useState<ProductVariation[]>(isNew ? [] : (product.variations || []));

  // State for adding a new variation
  const [newVarName, setNewVarName] = useState('');

  const toggleRequirement = (reqId: string) => {
    setRequirements(prev =>
      prev.includes(reqId) ? prev.filter(r => r !== reqId) : [...prev, reqId]
    );
  };

  const handleAddVariation = () => {
    if (!newVarName.trim()) return;
    const newVar: ProductVariation = {
      id: `var-${Date.now()}`,
      name: newVarName.trim(),
      options: [
        { id: `opt-${Date.now()}-1`, name: 'Option 1', price }
      ]
    };
    setVariations(prev => [...prev, newVar]);
    setNewVarName('');
  };

  const handleRemoveVariation = (varId: string) => {
    setVariations(prev => prev.filter(v => v.id !== varId));
  };

  const handleAddOption = (varId: string) => {
    setVariations(prev => prev.map(v => {
      if (v.id === varId) {
        return {
          ...v,
          options: [
            ...v.options,
            { id: `opt-${Date.now()}`, name: `Option ${v.options.length + 1}`, price }
          ]
        };
      }
      return v;
    }));
  };

  const handleRemoveOption = (varId: string, optId: string) => {
    setVariations(prev => prev.map(v => {
      if (v.id === varId) {
        return {
          ...v,
          options: v.options.filter(o => o.id !== optId)
        };
      }
      return v;
    }));
  };

  const handleOptionChange = (varId: string, optId: string, field: 'name' | 'price', value: string | number) => {
    setVariations(prev => prev.map(v => {
      if (v.id === varId) {
        return {
          ...v,
          options: v.options.map(o => {
            if (o.id === optId) {
              return {
                ...o,
                [field]: field === 'price' ? Number(value) : value
              };
            }
            return o;
          })
        };
      }
      return v;
    }));
  };

  const handleAddImageUrl = () => {
    const value = newImgInput.trim();
    if (!value) return;
    try {
      const url = new URL(value, window.location.origin);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        onError('Use an HTTP or HTTPS image URL.');
        return;
      }
      setImages((current) => [...current, value]);
      setNewImgInput('');
    } catch {
      setModalError('Enter a valid image URL.');
      onError('Enter a valid image URL.');
    }
  };

  const handleUploadImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setIsUploadingImage(true);
    setModalError(null);
    try {
      const processedUrls: string[] = [];
      for (const file of files) {
        // Compress client-side into compact high-clarity WebP Data URL (Issue #20 & #21)
        const compressedDataUrl = await compressImage(file, { maxWidth: 720, maxHeight: 720, quality: 0.78 });
        processedUrls.push(compressedDataUrl);
      }
      setImages((current) => [...current, ...processedUrls]);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Image processing failed.';
      setModalError(msg);
      onError(msg);
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
  };

  const handleUploadVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setModalError(null);
    setIsUploadingVideo(true);
    try {
      if (file.size > 15 * 1024 * 1024) {
        setModalError('Video file exceeds 15 MB. Please compress the video or enter an external hosted video URL.');
        setIsUploadingVideo(false);
        return;
      }

      // Try server video upload first
      try {
        const formData = new FormData();
        formData.append('video', file);
        const adminToken = (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('alldisplay_admin_token') : null)
          || (typeof localStorage !== 'undefined' ? localStorage.getItem('alldisplay_admin_token') : null);
        const response = await fetch('/api/admin/video-uploads', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'X-Admin-Request': '1',
            ...(adminToken ? { 'X-Admin-Token': adminToken } : {}),
          },
          body: formData,
        });
        if (response.ok) {
          const result = await response.json();
          if (result.url) {
            setVideoUrl(result.url);
            return;
          }
        }
      } catch {
        // Fallback to data URL for small local videos
      }

      // Fallback to data URL for local videos
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read video file.'));
        reader.readAsDataURL(file);
      });
      setVideoUrl(dataUrl);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Video upload failed. You can paste a hosted video URL.';
      setModalError(msg);
      onError(msg);
    } finally {
      setIsUploadingVideo(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!category || !category.trim()) {
      const msg = 'Please create at least one Main Category in the Categories tab before creating products.';
      setModalError(msg);
      onError(msg);
      return;
    }
    if (images.length === 0) {
      setModalError('Add at least one product photo before saving.');
      onError('Add at least one product photo before saving.');
      return;
    }
    const products = storeManager.getProducts();
    const primaryImage = images[0];
    let saved: boolean;

    if (isNew) {
      const now = new Date().toISOString();
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        code,
        title,
        description: 'Premium jewellery display and packaging solution manufactured with high-quality velvet, acrylic, and precision finish.',
        price,
        originalPrice,
        unit,
        rating: 4.9,
        reviewCount: 18,
        loadCapacity: 'Standard Jewelry Display',
        category,
        subCategory: subCategory.trim() || undefined,
        childCategory: childCategory.trim() || undefined,
        finish,
        material,
        structuralProfile: 'Fine Handcrafted / Commercial Grade',
        dispatchReadiness,
        stockStatus,
        moq,
        image: primaryImage,
        images,
        requirements,
        variations: variations.length > 0 ? variations : undefined,
        ...(videoUrl.trim() ? { videoUrl: videoUrl.trim() } : {}),
        createdAt: now,
        sortOrder: 0,
      };
      saved = await storeManager.saveProducts([newProduct, ...products]);
    } else {
      const updated = products.map((p) => (p.id === product.id ? {
        ...p,
        title,
        code,
        category,
        subCategory: subCategory.trim() || undefined,
        childCategory: childCategory.trim() || undefined,
        price,
        originalPrice,
        unit,
        moq,
        image: primaryImage,
        images,
        videoUrl: videoUrl.trim() || undefined,
        finish,
        material,
        stockStatus,
        dispatchReadiness,
        requirements,
        variations: variations.length > 0 ? variations : undefined,
        finishes: undefined,
      } : p));
      saved = await storeManager.saveProducts(updated);
    }

    if (saved) {
      onSave();
    } else {
      const err = 'Product could not be saved to the shared catalog. Check the database sync error and try again.';
      setModalError(err);
      onError(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 touch-none overscroll-none">
      <div className="bg-white max-w-3xl w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] overscroll-contain">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <AppIcon name="add_photo_alternate" className="text-orange-400" />
            <h2 className="font-bold text-base sm:text-lg">
              {isNew ? 'Add New Product' : `Edit Product: ${code}`}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <AppIcon name="close" className="text-[20px]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto overscroll-contain" data-scrollable="true">
          {/* Issue #22: Error visible directly inside modal */}
          {modalError && (
            <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AppIcon name="error" className="text-base text-red-600" />
                <span>{modalError}</span>
              </div>
              <button type="button" onClick={() => setModalError(null)} className="text-red-500 hover:text-red-800 p-1 cursor-pointer">
                <AppIcon name="close" className="text-sm" />
              </button>
            </div>
          )}
          
          {/* Title & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Product Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 10 Pair Earring Display Stand"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">SKU Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. VP-EDS-401"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Category Hierarchy: Main Category, Sub-Category (Optional), Child Category (Optional) */}
          <div className="flex flex-col gap-2.5 p-4 bg-slate-50/80 border border-slate-200/90 rounded-2xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <AppIcon name="category" className="text-orange-600 text-sm" />
                <span>Product Categorization Hierarchy</span>
              </label>
              <span className="text-[10px] text-slate-500 font-medium">
                Sub-Category &amp; Child Category are optional
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. Category (Required) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
                  <span>1. Category (Required)</span>
                  <span className="text-[9px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.2 rounded">Required</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubCategory('');
                    setChildCategory('');
                  }}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-orange-500 transition-all"
                >
                  {rootCategories.length === 0 && (
                    <option value="">-- No categories exist yet (Create in Categories tab) --</option>
                  )}
                  {rootCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                {rootCategories.length === 0 && (
                  <span className="text-[10px] text-amber-600 font-medium">
                    ⚠️ Go to the Categories tab to create your main category hierarchy first.
                  </span>
                )}
              </div>

              {/* 2. Sub-Category (Optional) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
                  <span>2. Sub-Category</span>
                  <span className="text-[9px] text-slate-400">Optional</span>
                </label>
                <select
                  value={subCategory}
                  onChange={(e) => {
                    setSubCategory(e.target.value);
                    setChildCategory('');
                  }}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-orange-500 transition-all"
                >
                  <option value="">-- None (No Sub-Category) --</option>
                  {availableSubCategories.map((sub) => (
                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
                {availableSubCategories.length === 0 && (
                  <span className="text-[10px] text-slate-400">No sub-categories created under this category</span>
                )}
              </div>

              {/* 3. Child Category (Optional) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
                  <span>3. Child Category</span>
                  <span className="text-[9px] text-slate-400">Optional</span>
                </label>
                <select
                  value={childCategory}
                  disabled={!subCategory}
                  onChange={(e) => setChildCategory(e.target.value)}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-orange-500 disabled:opacity-50 disabled:bg-slate-100 transition-all"
                >
                  <option value="">-- None (No Child Category) --</option>
                  {availableChildCategories.map((child) => (
                    <option key={child.id} value={child.name}>{child.name}</option>
                  ))}
                </select>
                {!subCategory ? (
                  <span className="text-[10px] text-slate-400">Select a sub-category first</span>
                ) : availableChildCategories.length === 0 ? (
                  <span className="text-[10px] text-slate-400">No child categories under this sub-category</span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Pricing & Units */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Selling Price (₹)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-bold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Original MRP (₹)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Unit Label</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="piece / pack / set"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Minimum Order (MOQ)</label>
              <input
                type="text"
                value={moq}
                onChange={(e) => setMoq(e.target.value)}
                placeholder="e.g. MOQ: 1 Pack"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Material, MOQ, Finish & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Material</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="Velvet / Solid Wood / Acrylic"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Minimum Order (MOQ)</label>
              <input
                type="text"
                value={moq}
                onChange={(e) => setMoq(e.target.value)}
                placeholder="MOQ: 1 Pack"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-800">Stock Status</label>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value)}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
              >
                <option value="Feel Khana In Stock">Feel Khana In Stock</option>
                <option value="Hyderabad Depot Ready Stock">Hyderabad Depot Ready Stock</option>
                <option value="Sold Out / Make to Order">Sold Out / Make to Order</option>
              </select>
            </div>
          </div>

          {/* SHOP BY REQUIREMENT TAGS (Multiple) */}
          <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 flex flex-col gap-2.5">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <AppIcon name="sell" className="text-orange-500 text-sm" />
              Shop by Requirement Tags (Select all that apply)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ALL_REQUIREMENTS.map((req) => {
                const isChecked = requirements.includes(req.id);
                return (
                  <label
                    key={req.id}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-orange-600 text-white border-orange-600 font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleRequirement(req.id)}
                      className="accent-white rounded"
                    />
                    <span>{req.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* PRODUCT VARIATIONS BUILDER */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase">
                  <AppIcon name="tune" className="text-orange-600 text-sm" />
                  Product Variations &amp; Pack Sizes ({variations.length})
                </h3>
                <p className="text-[10px] text-slate-500">
                  Add color options, size tiers, or bulk pack options with dynamic pricing.
                </p>
              </div>
            </div>

            {/* List of current variations */}
            {variations.map((v) => (
              <div key={v.id} className="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-xs text-slate-900">{v.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddOption(v.id)}
                      className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <AppIcon name="add" className="text-xs" />
                      Add Option
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariation(v.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer ml-2"
                    >
                      Delete Variation
                    </button>
                  </div>
                </div>

                {/* Options Table */}
                <div className="flex flex-col gap-2">
                  {v.options.map((opt) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={opt.name}
                        onChange={(e) => handleOptionChange(v.id, opt.id, 'name', e.target.value)}
                        placeholder="Option name (e.g. Beige Velvet, 4-Layer, Pack of 500)"
                        className="flex-1 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-slate-500">₹</span>
                        <input
                          type="number"
                          value={opt.price ?? price}
                          onChange={(e) => handleOptionChange(v.id, opt.id, 'price', e.target.value)}
                          placeholder="Price override"
                          className="w-24 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(v.id, opt.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove option"
                      >
                        <AppIcon name="close" className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Add new variation input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newVarName}
                onChange={(e) => setNewVarName(e.target.value)}
                placeholder="New variation group (e.g. Color Finish, Height, Pack Quantity)"
                className="flex-1 p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800"
              />
              <button
                type="button"
                onClick={handleAddVariation}
                disabled={!newVarName.trim()}
                className="bg-slate-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                + Add Variation
              </button>
            </div>
          </div>

          {/* Multi-Image Gallery Manager */}
          <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <AppIcon name="imagesmode" className="text-sm text-orange-600" />
                Product Photos ({images.length}) - First photo is primary thumbnail
              </label>
            </div>

            {/* Thumbnails Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-1">
              {images.map((imgUrl, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white aspect-square shadow-xs">
                  <img src={imgUrl} alt={`Product photo ${index + 1}`} className="w-full h-full object-cover" />
                  {index === 0 && (
                    <span className="absolute top-1 left-1 bg-orange-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 hover:scale-110 transition-all cursor-pointer shadow-xs"
                    title="Remove image"
                  >
                    <AppIcon name="delete" className="text-[14px] block" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Image Input */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={newImgInput}
                onChange={(e) => setNewImgInput(e.target.value)}
                placeholder="Paste image URL (https://...)"
                className="flex-1 p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="bg-slate-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <AppIcon name="add_a_photo" className="text-sm" />
                Add URL
              </button>
            </div>
            <label className={`mt-1 flex items-center justify-center gap-2 rounded-xl border border-dashed border-orange-300 px-4 py-3 text-xs font-semibold text-orange-700 bg-orange-50/50 ${
              isUploadingImage ? 'opacity-60 cursor-wait' : 'cursor-pointer hover:bg-orange-50'
            }`}>
              <AppIcon name={isUploadingImage ? 'progress_activity' : 'upload_file'} className="text-[18px]" />
              {isUploadingImage ? 'Uploading image...' : 'Choose image(s) from this device'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                disabled={isUploadingImage}
                onChange={handleUploadImages}
                className="sr-only"
              />
            </label>
            <p className="text-[10px] text-slate-500 italic">
              JPEG, PNG, WebP, or GIF; max 5 MB per image.
            </p>
          </div>

          {/* Video Manager */}
          <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label htmlFor="product-video-url" className="text-xs font-bold text-slate-800">Product Video (optional)</label>
              <p className="mt-1 text-[10px] text-slate-500">Upload an MP4, WebM, or MOV file (max 50 MB), or enter a hosted video URL.</p>
            </div>
            <input
              id="product-video-url"
              type="url"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="https://... or upload a video below"
              className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-mono focus:outline-none focus:border-orange-500"
            />
            <div className="flex flex-wrap items-center gap-3">
              <label className={`inline-flex items-center gap-2 rounded-xl border border-dashed border-orange-300 px-4 py-3 text-xs font-semibold text-orange-700 bg-orange-50/50 ${
                isUploadingVideo ? 'opacity-60 cursor-wait' : 'cursor-pointer hover:bg-orange-50'
              }`}>
                <AppIcon name={isUploadingVideo ? 'progress_activity' : 'videocam'} className="text-[18px]" />
                {isUploadingVideo ? 'Uploading video...' : 'Choose video'}
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  disabled={isUploadingVideo}
                  onChange={(event) => void handleUploadVideo(event)}
                  className="sr-only"
                />
              </label>
              {videoUrl && (
                <button
                  type="button"
                  onClick={() => setVideoUrl('')}
                  className="text-xs font-semibold text-red-600 hover:text-red-800 cursor-pointer"
                >
                  Remove video
                </button>
              )}
            </div>
            {videoUrl && <video src={videoUrl} controls preload="metadata" className="w-full max-h-56 rounded-xl bg-black" />}
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
            >
              Save &amp; Sync Storefront
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
