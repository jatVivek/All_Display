import { AppIcon } from '../../components/AppIcon';
import React, { useState } from 'react';
import { HomepageBanner } from '../../types';
import { storeManager } from '../../services/storeManager';
import { LoadingButton } from '../../components/LoadingStates';

interface AdminHomepageViewProps {
  showToast: (msg: string) => void;
}

const createBanner = (): HomepageBanner => {
  const firstCategory = storeManager.getCategories()[0];
  const firstProduct = storeManager.getProducts()[0];
  return {
    id: `banner-${Date.now()}`,
    eyebrow: '',
    title: '',
    subtitle: '',
    description: '',
    image: '',
    linkType: firstCategory ? 'category' : 'product',
    linkId: firstCategory?.id ?? firstProduct?.id ?? '',
  };
};

export const AdminHomepageView: React.FC<AdminHomepageViewProps> = ({ showToast }) => {
  const [banners, setBanners] = useState(() => storeManager.getHomepageBanners());
  const [dealProductIds, setDealProductIds] = useState(() => storeManager.getHomepageDealProductIds());
  const [products, setProducts] = useState(() => storeManager.getProducts());
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingBannerId, setUploadingBannerId] = useState<string | null>(null);
  const categories = storeManager.getCategories();

  React.useEffect(() => storeManager.subscribe((state) => {
    setProducts(state.products);
  }), []);

  const updateBanner = (id: string, updates: Partial<HomepageBanner>) => {
    setBanners((current) => current.map((banner) =>
      banner.id === id ? { ...banner, ...updates } : banner
    ));
  };

  const handleLinkTypeChange = (banner: HomepageBanner, linkType: HomepageBanner['linkType']) => {
    const options = linkType === 'category' ? categories : products;
    updateBanner(banner.id, { linkType, linkId: options[0]?.id ?? '' });
  };

  const handleImageUpload = async (bannerId: string, field: 'image' | 'mobileImage', file?: File) => {
    if (!file) return;
    setUploadingBannerId(bannerId);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('/api/admin/uploads', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'X-Admin-Request': '1' },
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Image upload failed (${response.status}).`);
      updateBanner(bannerId, { [field]: result.url });
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setUploadingBannerId(null);
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (banners.some((banner) => !banner.title.trim() || !banner.image.trim() || !banner.linkId)) {
      showToast('Every banner needs a headline, image, and category or product link.');
      return;
    }
    setIsSaving(true);
    try {
      if (!await storeManager.saveHomepageBanners(banners, dealProductIds)) {
        showToast(storeManager.getState().catalogSyncError || 'Could not save homepage banners.');
        return;
      }
      showToast('Homepage banners saved successfully.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-[#e6e2dc] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AppIcon name="view_carousel" className="text-[#775a00] text-[24px]" />
            <h1 className="font-serif text-2xl font-bold text-[#1c1c18]">Homepage Banners</h1>
          </div>
          <p className="text-xs text-[#76777b]">
            Create multiple storefront banners and link each one to a category or product.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setBanners((current) => [...current, createBanner()])}
          className="bg-[#1a1c20] hover:bg-black text-[#ffdf98] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
        >
          <AppIcon name="add" className="text-[18px]" />
          Add Banner
        </button>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <section className="bg-white rounded-2xl p-6 border border-[#e6e2dc] shadow-sm flex flex-col gap-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#1c1c18]">Deal of the Day</h2>
            <p className="mt-1 text-xs text-[#76777b]">Choose the products to feature in the storefront’s daily deals section.</p>
          </div>
          {products.length === 0 ? (
            <p className="text-xs text-[#76777b]">Add products to the catalog before choosing deal products.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
              {products.map((product) => (
                <label key={product.id} className="flex items-center gap-3 rounded-xl border border-[#e6e2dc] p-3 cursor-pointer hover:bg-[#fdf9f3]">
                  <input
                    type="checkbox"
                    checked={dealProductIds.includes(product.id)}
                    onChange={(event) => setDealProductIds((current) => (
                      event.target.checked
                        ? [...current, product.id]
                        : current.filter((id) => id !== product.id)
                    ))}
                    className="h-4 w-4 accent-[#1a1c20]"
                  />
                  <img src={product.image} alt="" className="h-12 w-12 rounded-lg object-cover bg-[#f7f3ed]" />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold text-[#1c1c18]">{product.title}</span>
                    <span className="block text-[10px] text-[#76777b]">{product.code}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </section>

        {banners.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-dashed border-[#e6e2dc] text-center text-sm text-[#76777b]">
            No banners yet. Add a banner to display it on the storefront.
          </div>
        )}

        {banners.map((banner, index) => {
          const linkOptions = banner.linkType === 'category' ? categories : products;
          return (
            <section key={banner.id} className="bg-white rounded-2xl p-6 border border-[#e6e2dc] shadow-sm flex flex-col gap-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-serif font-bold text-base text-[#1c1c18]">Banner {index + 1}</h2>
                <button
                  type="button"
                  onClick={() => setBanners((current) => current.filter((item) => item.id !== banner.id))}
                  className="text-xs font-semibold text-red-700 hover:text-red-900 flex items-center gap-1 cursor-pointer"
                  aria-label={`Remove banner ${index + 1}`}
                >
                  <AppIcon name="delete" className="text-[18px]" />
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#1c1c18]">
                  Small heading
                  <input
                    type="text"
                    value={banner.eyebrow}
                    onChange={(event) => updateBanner(banner.id, { eyebrow: event.target.value })}
                    maxLength={160}
                    className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] font-normal focus:outline-none focus:border-[#775a00]"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#1c1c18]">
                  Headline
                  <input
                    type="text"
                    value={banner.title}
                    onChange={(event) => updateBanner(banner.id, { title: event.target.value })}
                    maxLength={200}
                    required
                    className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] font-normal focus:outline-none focus:border-[#775a00]"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#1c1c18] md:col-span-2">
                  Subtitle
                  <input
                    type="text"
                    value={banner.subtitle}
                    onChange={(event) => updateBanner(banner.id, { subtitle: event.target.value })}
                    maxLength={240}
                    className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] font-normal focus:outline-none focus:border-[#775a00]"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#1c1c18] md:col-span-2">
                  Description
                  <textarea
                    rows={3}
                    value={banner.description}
                    onChange={(event) => updateBanner(banner.id, { description: event.target.value })}
                    maxLength={1000}
                    className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] font-normal focus:outline-none focus:border-[#775a00]"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#1c1c18] md:col-span-2">
                  Banner image URL
                  <input
                    type="url"
                    value={banner.image}
                    onChange={(event) => updateBanner(banner.id, { image: event.target.value })}
                    placeholder="https://... or upload an image below"
                    required
                    className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] font-normal focus:outline-none focus:border-[#775a00]"
                  />
                </label>
                <div className="md:col-span-2 flex flex-col gap-3 rounded-xl bg-[#f7f3ed] p-4">
                  <span className="text-xs font-semibold text-[#1c1c18]">Desktop image</span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className={`inline-flex w-fit items-center gap-2 rounded-xl border border-dashed border-[#775a00]/50 px-4 py-3 text-xs font-semibold text-[#775a00] ${
                    uploadingBannerId === banner.id ? 'opacity-60 cursor-wait' : 'cursor-pointer hover:bg-[#ffdf98]/20'
                  }`}>
                    <AppIcon name={uploadingBannerId === banner.id ? 'progress_activity' : 'upload_file'} className="text-[18px]" />
                    {uploadingBannerId === banner.id ? 'Uploading...' : 'Upload image'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      disabled={uploadingBannerId === banner.id}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = '';
                        void handleImageUpload(banner.id, 'image', file);
                      }}
                      className="sr-only"
                    />
                  </label>
                  {banner.image && (
                    <img src={banner.image} alt="" className="h-16 w-28 object-cover rounded-lg border border-[#e6e2dc]" />
                  )}
                  <span className="text-[10px] text-[#76777b]">Wide 16:9 or 2:1 image. WebP/JPEG under 200 KB recommended; max 5 MB.</span>
                  </div>
                </div>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#1c1c18] md:col-span-2">
                  Mobile image URL (optional)
                  <input
                    type="url"
                    value={banner.mobileImage ?? ''}
                    onChange={(event) => updateBanner(banner.id, { mobileImage: event.target.value })}
                    placeholder="Use a vertical 2:3 or square image for mobile screens"
                    className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] font-normal focus:outline-none focus:border-[#775a00]"
                  />
                </label>
                <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className={`inline-flex w-fit items-center gap-2 rounded-xl border border-dashed border-[#775a00]/50 px-4 py-3 text-xs font-semibold text-[#775a00] ${
                    uploadingBannerId === banner.id ? 'opacity-60 cursor-wait' : 'cursor-pointer hover:bg-[#ffdf98]/20'
                  }`}>
                    <AppIcon name={uploadingBannerId === banner.id ? 'progress_activity' : 'upload_file'} className="text-[18px]" />
                    {uploadingBannerId === banner.id ? 'Uploading...' : 'Upload mobile image'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      disabled={uploadingBannerId === banner.id}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = '';
                        void handleImageUpload(banner.id, 'mobileImage', file);
                      }}
                      className="sr-only"
                    />
                  </label>
                  {banner.mobileImage && (
                    <img src={banner.mobileImage} alt="" className="h-16 w-16 object-cover rounded-lg border border-[#e6e2dc]" />
                  )}
                  <span className="text-[10px] text-[#76777b]">Use a vertical 2:3 or square image; optional. WebP under 200 KB recommended.</span>
                </div>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#1c1c18]">
                  Link type
                  <select
                    value={banner.linkType}
                    onChange={(event) => handleLinkTypeChange(banner, event.target.value as HomepageBanner['linkType'])}
                    className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] font-normal focus:outline-none focus:border-[#775a00]"
                  >
                    <option value="category">Category</option>
                    <option value="product">Product</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#1c1c18]">
                  Link to
                  <select
                    value={banner.linkId}
                    onChange={(event) => updateBanner(banner.id, { linkId: event.target.value })}
                    required
                    className="p-3 rounded-xl bg-[#fdf9f3] border border-[#e6e2dc] font-normal focus:outline-none focus:border-[#775a00]"
                  >
                    <option value="">Select {banner.linkType}</option>
                    {linkOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {'name' in option ? option.name : `${option.title} (${option.code})`}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>
          );
        })}

        <div className="pt-4 border-t border-[#e6e2dc] flex justify-end">
          <LoadingButton
            type="submit"
            loading={isSaving}
            loadingLabel="Saving banners..."
            disabled={uploadingBannerId !== null}
            className="inline-flex items-center justify-center gap-2 bg-[#1a1c20] hover:bg-black disabled:opacity-60 text-[#ffdf98] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
          >
            Save Homepage Banners
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};
