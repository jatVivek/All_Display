import React, { useState } from 'react';
import { Product } from '../../types';
import { storeManager } from '../../services/storeManager';

interface AdminProductEditorModalProps {
  product: Product | 'new';
  onClose: () => void;
  onSave: () => void;
}

export const AdminProductEditorModal: React.FC<AdminProductEditorModalProps> = ({
  product,
  onClose,
  onSave
}) => {
  const isNew = product === 'new';
  const [title, setTitle] = useState(isNew ? '' : product.title);
  const [code, setCode] = useState(isNew ? 'AD-NEW-001' : product.code);
  const [category, setCategory] = useState(isNew ? 'Floor Stands & Bumper Racks' : product.category);
  const [price, setPrice] = useState(isNew ? 5000 : product.price);
  const [unit, setUnit] = useState(isNew ? 'unit' : product.unit);
  
  // Multiple images support
  const defaultImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjsvmXZlohMZptyHS-gMam8Ct3W1nVaqsr_mc0zz2CFqebliYcutec3B9BqZlE6DXkvhqWI7GDLzzMYlG39q8zVA9hzToMg32UZPukc45kD7EsyTvVHGXhV2FwJETW4HGVdCH5tsOWaHksqiYH8uqi33EAjJs1Z1xhpkTxYcv-L-yfmtMf0mvfHtQanYLYdLU0NxlKlIok4FYgainzT43AvDWJaPz25hj292y3bKucJBicVMNTHk09';
  const initialImages = isNew 
    ? [defaultImage] 
    : (product.images && product.images.length > 0 ? product.images : [product.image]);

  const [images, setImages] = useState<string[]>(initialImages);
  const [newImgInput, setNewImgInput] = useState('');

  const [finish, setFinish] = useState(isNew ? 'Matte Black Powder Coat' : product.finish);
  const [stockStatus, setStockStatus] = useState(isNew ? 'Ranigunj In Stock' : product.stockStatus);

  const handleAddImage = () => {
    if (!newImgInput.trim()) return;
    setImages([...images, newImgInput.trim()]);
    setNewImgInput('');
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      alert('Product must have at least one image.');
      return;
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const products = storeManager.getProducts();
    const primaryImage = images[0] || defaultImage;

    if (isNew) {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        code,
        title,
        description: 'Heavy duty commercial grade retail display fixture manufactured at Ranigunj facility with premium anti-rust coating.',
        price,
        originalPrice: price + 1200,
        unit,
        rating: 4.9,
        reviewCount: 22,
        loadCapacity: '>120kg Heavy Duty',
        category,
        finish,
        structuralProfile: 'Commercial Grade Steel Profile',
        dispatchReadiness: 'Same-Day Dispatch from Ranigunj',
        stockStatus,
        moq: 'MOQ: 1 Unit',
        image: primaryImage,
        images: images,
        finishes: [
          { name: finish, color: '#1A1C20' },
          { name: 'Brushed Gold', color: '#D4AF37' }
        ]
      };
      storeManager.saveProducts([newProduct, ...products]);
    } else {
      const updated = products.map((p) => (p.id === product.id ? {
        ...p,
        title,
        code,
        category,
        price,
        unit,
        image: primaryImage,
        images: images,
        finish,
        stockStatus
      } : p));
      storeManager.saveProducts(updated);
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl border border-[#e6e2dc] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1a1c20] text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffdf98]">add_photo_alternate</span>
            <h2 className="font-serif font-bold text-base sm:text-lg">
              {isNew ? 'Add New Wholesale Product' : `Edit Product: ${code}`}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1c1c18]">Product Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Commercial Triple Pipe Rack"
                className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs focus:outline-none focus:border-[#775a00]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1c1c18]">SKU Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. AD-TPR-739"
                className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs font-mono focus:outline-none focus:border-[#775a00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1c1c18]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs focus:outline-none focus:border-[#775a00]"
              >
                {storeManager.getCategories().map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1c1c18]">Ex-Factory Price (₹)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs font-mono focus:outline-none focus:border-[#775a00]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1c1c18]">Unit Label</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="unit / bay / set"
                className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs focus:outline-none focus:border-[#775a00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1c1c18]">Finish Spec</label>
              <input
                type="text"
                value={finish}
                onChange={(e) => setFinish(e.target.value)}
                placeholder="Matte Black Powder Coat"
                className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs focus:outline-none focus:border-[#775a00]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1c1c18]">Stock Status</label>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value)}
                className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] text-xs focus:outline-none focus:border-[#775a00]"
              >
                <option value="Ranigunj In Stock">Ranigunj In Stock</option>
                <option value="Begum Bazaar Depot Stock">Begum Bazaar Depot Stock</option>
                <option value="Sold Out / Make to Order">Sold Out / Make to Order</option>
              </select>
            </div>
          </div>

          {/* Multi-Image Gallery Manager */}
          <div className="flex flex-col gap-2 p-4 bg-[#fdf9f3] rounded-2xl border border-[#e6e2dc]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1c1c18] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#775a00]">imagesmode</span>
                Product Photos ({images.length}) - First photo is primary thumbnail
              </label>
            </div>

            {/* Thumbnails Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-1">
              {images.map((imgUrl, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden border border-[#e6e2dc] bg-white aspect-square shadow-xs">
                  <img src={imgUrl} alt={`Product photo ${index + 1}`} className="w-full h-full object-cover" />
                  {index === 0 && (
                    <span className="absolute top-1 left-1 bg-[#1a1c20] text-[#ffdf98] text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 hover:scale-110 transition-all cursor-pointer shadow"
                    title="Remove image"
                  >
                    <span className="material-symbols-outlined text-[14px] block">delete</span>
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
                className="flex-1 p-2.5 rounded-xl bg-white border border-[#e6e2dc] text-xs font-mono focus:outline-none focus:border-[#775a00]"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-[#1a1c20] hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-sm">add_a_photo</span>
                Add Photo
              </button>
            </div>
            <p className="text-[10px] text-[#63635e] italic">
              Tip: You can add multiple photos for storefront zoom and gallery preview.
            </p>
          </div>

          <div className="pt-4 border-t border-[#e6e2dc] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#f1ede7] hover:bg-[#ebe8e2] text-[#1c1c18] px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#1a1c20] hover:bg-black text-[#ffdf98] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
            >
              Save &amp; Sync Storefront
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
