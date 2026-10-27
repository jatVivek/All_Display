import { AppIcon } from '../../components/AppIcon';
import React, { useState } from 'react';
import { HomepageBanner } from '../../types';
import { storeManager } from '../../services/storeManager';
import { LoadingButton } from '../../components/LoadingStates';
import { ImageCropperModal, CropAspectRatio } from '../components/ImageCropperModal';
import { compressImage } from '../../utils/imageCompressor';

interface AdminHomepageViewProps {
  showToast: (msg: string) => void;
}

// Issue #28: Clean blank template without static hardcoded dummy data
const createBanner = (): HomepageBanner => ({
  id: `banner-${Date.now()}`,
  eyebrow: '',
  title: '',
  subtitle: '',
  description: '',
  image: '',
  linkType: 'none',
  linkId: '',
});

export const AdminHomepageView: React.FC<AdminHomepageViewProps> = ({ showToast }) => {
  const [banners, setBanners] = useState(() => storeManager.getHomepageBanners());
  const [products, setProducts] = useState(() => storeManager.getProducts());
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingBannerId, setUploadingBannerId] = useState<string | null>(null);

  // Cropper Modal state
  const [cropperConfig, setCropperConfig] = useState<{
    isOpen: boolean;
    bannerId: string;
    field: 'image' | 'mobileImage';
    imageSrc: string;
    aspectRatio: CropAspectRatio;
    title: string;
  } | null>(null);

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
    if (linkType === 'none') {
      updateBanner(banner.id, { linkType: 'none', linkId: '' });
      return;
    }
    const options = linkType === 'category' ? categories : products;
    updateBanner(banner.id, { linkType, linkId: options[0]?.id ?? '' });
  };

  // Open cropper on local file selection
  const handleFileSelected = (bannerId: string, field: 'image' | 'mobileImage', file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropperConfig({
        isOpen: true,
        bannerId,
        field,
        imageSrc: reader.result as string,
        aspectRatio: field === 'mobileImage' ? '4:3' : '16:9',
        title: field === 'mobileImage' ? 'Crop Mobile Banner (4:3 Uniform)' : 'Crop Desktop Hero Banner (16:9 Uniform)',
      });
    };
    reader.readAsDataURL(file);
  };

  // Open cropper for an existing image URL
  const handleExistingImageCrop = (bannerId: string, field: 'image' | 'mobileImage', currentUrl: string) => {
    if (!currentUrl) return;
    setCropperConfig({
      isOpen: true,
      bannerId,
      field,
      imageSrc: currentUrl,
      aspectRatio: field === 'mobileImage' ? '4:3' : '16:9',
      title: field === 'mobileImage' ? 'Re-frame Mobile Banner (4:3 Uniform)' : 'Re-frame Desktop Hero Banner (16:9 Uniform)',
    });
  };

  // Execute upload after crop directly into high-clarity WebP Data URL
  const handleUploadCroppedFile = async (bannerId: string, field: 'image' | 'mobileImage', file: File) => {
    setUploadingBannerId(bannerId);
    try {
      const dataUrl = await compressImage(file, {
        maxWidth: field === 'mobileImage' ? 800 : 1280,
        maxHeight: field === 'mobileImage' ? 600 : 720,
        quality: 0.82,
      });
      updateBanner(bannerId, { [field]: dataUrl });
      showToast('Cropped uniform banner applied successfully!');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Image processing failed.');
    } finally {
      setUploadingBannerId(null);
    }
  };

  // Issue #26 & #30: Relaxed saving validation (link is optional)
  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (banners.some((banner) => !banner.title.trim() || !banner.image.trim())) {
      showToast('Every banner needs a headline title and desktop image URL.');
      return;
    }
    setIsSaving(true);
    try {
      const currentDeals = storeManager.getHomepageDealProductIds();
      if (!await storeManager.saveHomepageBanners(banners, currentDeals)) {
        showToast(storeManager.getState().catalogSyncError || 'Could not save homepage banners.');
        return;
      }
      showToast('Homepage banners saved and synced successfully!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <AppIcon name="view_carousel" className="text-orange-600 text-[24px]" />
            <h1 className="text-2xl font-bold text-slate-900">Homepage Hero Banners</h1>
          </div>
          <p className="text-xs text-slate-500">
            Customize storefront hero promotional banners with standardized uniform cropping.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setBanners((current) => [...current, createBanner()])}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <AppIcon name="add" className="text-[18px]" />
          Add Banner
        </button>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {banners.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-200 text-center text-sm text-slate-500">
            No banners yet. Click &ldquo;Add Banner&rdquo; to create one.
          </div>
        )}

        {banners.map((banner, index) => {
          const isLinked = banner.linkType && banner.linkType !== 'none';
          const linkOptions = banner.linkType === 'category' ? categories : products;

          return (
            <section key={banner.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h2 className="font-bold text-base text-slate-900">Banner {index + 1}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setBanners((current) => current.filter((item) => item.id !== banner.id))}
                  className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                  aria-label={`Remove banner ${index + 1}`}
                >
                  <AppIcon name="delete" className="text-[18px]" />
                  Remove Banner
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-800">
                  Small Eyebrow Tag (Optional)
                  <input
                    type="text"
                    value={banner.eyebrow || ''}
                    onChange={(event) => updateBanner(banner.id, { eyebrow: event.target.value })}
                    maxLength={160}
                    placeholder="e.g. Special Offer or New Collection"
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-normal text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-800">
                  Headline Title *
                  <input
                    type="text"
                    value={banner.title}
                    onChange={(event) => updateBanner(banner.id, { title: event.target.value })}
                    maxLength={200}
                    required
                    placeholder="e.g. Premium Jewellery Displays"
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-normal text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-800 md:col-span-2">
                  Subtitle (Optional)
                  <input
                    type="text"
                    value={banner.subtitle || ''}
                    onChange={(event) => updateBanner(banner.id, { subtitle: event.target.value })}
                    maxLength={240}
                    placeholder="e.g. Direct Factory Wholesale Supply"
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-normal text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-800 md:col-span-2">
                  Description (Optional)
                  <textarea
                    rows={2}
                    value={banner.description || ''}
                    onChange={(event) => updateBanner(banner.id, { description: event.target.value })}
                    maxLength={1000}
                    placeholder="Detailed promotional text..."
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-normal text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all resize-none"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-800 md:col-span-2">
                  Banner Image URL (Desktop) *
                  <input
                    type="url"
                    value={banner.image}
                    onChange={(event) => updateBanner(banner.id, { image: event.target.value })}
                    placeholder="https://... or crop & upload an image below"
                    required
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  />
                </label>

                {/* Desktop Visual Cropper & Uploader */}
                <div className="md:col-span-2 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <AppIcon name="view_carousel" className="text-orange-600 text-sm" />
                      Desktop &amp; Laptop Hero Asset (Strict Uniform 16:9 Aspect Ratio)
                    </span>
                    <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
                      1600 × 900 px
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className={`inline-flex items-center gap-2 rounded-xl border border-dashed border-orange-400 px-4 py-2.5 text-xs font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer ${
                      uploadingBannerId === banner.id ? 'opacity-50 cursor-wait' : ''
                    }`}>
                      <AppIcon name={uploadingBannerId === banner.id ? 'progress_activity' : 'crop'} className="text-[18px]" />
                      <span>{uploadingBannerId === banner.id ? 'Uploading...' : 'Upload & Crop Desktop Image'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={uploadingBannerId === banner.id}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          event.target.value = '';
                          handleFileSelected(banner.id, 'image', file);
                        }}
                        className="sr-only"
                      />
                    </label>

                    {banner.image && (
                      <div className="flex items-center gap-3">
                        <img
                          src={banner.image}
                          alt="Desktop preview"
                          className="h-14 w-28 object-cover rounded-xl border border-slate-300 shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleExistingImageCrop(banner.id, 'image', banner.image)}
                          className="text-xs font-semibold text-slate-700 hover:text-orange-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:border-orange-300 transition-all cursor-pointer"
                        >
                          <AppIcon name="crop" className="text-xs" />
                          <span>Re-crop / Adjust</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Cropper guarantees every desktop banner renders with identical height and proportions on laptop/desktop viewports.
                  </p>
                </div>

                {/* Mobile Visual Cropper & Uploader */}
                <div className="md:col-span-2 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <AppIcon name="phone_android" className="text-orange-600 text-sm" />
                      Mobile &amp; Small Tablet Asset (Strict Uniform 4:3 Aspect Ratio)
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                      800 × 600 px
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className={`inline-flex items-center gap-2 rounded-xl border border-dashed border-orange-400 px-4 py-2.5 text-xs font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer ${
                      uploadingBannerId === `${banner.id}-mobile` ? 'opacity-50 cursor-wait' : ''
                    }`}>
                      <AppIcon name={uploadingBannerId === `${banner.id}-mobile` ? 'progress_activity' : 'crop'} className="text-[18px]" />
                      <span>{uploadingBannerId === `${banner.id}-mobile` ? 'Uploading...' : 'Upload & Crop Mobile Image'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={uploadingBannerId === `${banner.id}-mobile`}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          event.target.value = '';
                          handleFileSelected(banner.id, 'mobileImage', file);
                        }}
                        className="sr-only"
                      />
                    </label>

                    {banner.mobileImage && (
                      <div className="flex items-center gap-3">
                        <img
                          src={banner.mobileImage}
                          alt="Mobile preview"
                          className="h-14 w-18 object-cover rounded-xl border border-slate-300 shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleExistingImageCrop(banner.id, 'mobileImage', banner.mobileImage!)}
                          className="text-xs font-semibold text-slate-700 hover:text-orange-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:border-orange-300 transition-all cursor-pointer"
                        >
                          <AppIcon name="crop" className="text-xs" />
                          <span>Re-crop / Adjust</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Ensures mobile web banner takes standardized, compact space without shifting page layout.
                  </p>
                </div>

                {/* Issue #30: Link Type and Destination are Optional */}
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-800">
                  Link Type (Optional)
                  <select
                    value={banner.linkType || 'none'}
                    onChange={(event) => handleLinkTypeChange(banner, event.target.value as HomepageBanner['linkType'])}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                  >
                    <option value="none">None (Display Only)</option>
                    <option value="category">Category</option>
                    <option value="product">Product</option>
                  </select>
                </label>

                {isLinked ? (
                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-800">
                    Target Destination
                    <select
                      value={banner.linkId || ''}
                      onChange={(event) => updateBanner(banner.id, { linkId: event.target.value })}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                    >
                      <option value="">Select {banner.linkType}</option>
                      {linkOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {'name' in option ? option.name : `${option.title} (${option.code})`}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <div className="flex flex-col justify-center text-xs text-slate-500 pt-5">
                    <span>Banner button will explore the general shop catalog.</span>
                  </div>
                )}
              </div>
            </section>
          );
        })}

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <LoadingButton
            type="submit"
            loading={isSaving}
            loadingLabel="Saving banners..."
            disabled={uploadingBannerId !== null}
            className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs transition-colors"
          >
            Save Homepage Banners
          </LoadingButton>
        </div>
      </form>

      {/* Admin Visual Image Cropper Modal */}
      {cropperConfig && (
        <ImageCropperModal
          isOpen={cropperConfig.isOpen}
          imageSrc={cropperConfig.imageSrc}
          defaultAspectRatio={cropperConfig.aspectRatio}
          title={cropperConfig.title}
          onClose={() => setCropperConfig(null)}
          onCropComplete={async (file) => {
            await handleUploadCroppedFile(cropperConfig.bannerId, cropperConfig.field, file);
          }}
        />
      )}
    </div>
  );
};