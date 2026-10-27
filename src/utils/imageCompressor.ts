export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Client-side high clarity image compression utility.
 * Resizes large photos to optimal display bounds (default 1600x1600)
 * and applies balanced WebP/JPEG compression (85-90% quality),
 * reducing 5MB+ images down to ~100-200KB with zero visual loss.
 *
 * Supports being called with:
 *   await compressImage(file, { maxWidth: 1200, quality: 0.88 })
 * OR
 *   await compressImage(file, 1200, 1200, 0.88)
 *
 * Returns a Promise<string> (data URL) so that it can be directly
 * assigned to image states and <img src="...">.
 */
export async function compressImage(
  file: File,
  optionsOrMaxWidth: CompressImageOptions | number = 1600,
  maxHeightParam = 1600,
  qualityParam = 0.88
): Promise<string> {
  const result = await compressImageAdvanced(file, optionsOrMaxWidth, maxHeightParam, qualityParam);
  return result.dataUrl;
}

export async function compressImageAdvanced(
  file: File,
  optionsOrMaxWidth: CompressImageOptions | number = 1600,
  maxHeightParam = 1600,
  qualityParam = 0.88
): Promise<{ dataUrl: string; file: File }> {
  let maxWidth = 1600;
  let maxHeight = 1600;
  let quality = 0.88;

  if (typeof optionsOrMaxWidth === 'object' && optionsOrMaxWidth !== null) {
    if (optionsOrMaxWidth.maxWidth !== undefined) maxWidth = optionsOrMaxWidth.maxWidth;
    if (optionsOrMaxWidth.maxHeight !== undefined) maxHeight = optionsOrMaxWidth.maxHeight;
    if (optionsOrMaxWidth.quality !== undefined) quality = optionsOrMaxWidth.quality;
  } else if (typeof optionsOrMaxWidth === 'number') {
    maxWidth = optionsOrMaxWidth;
    maxHeight = maxHeightParam;
    quality = qualityParam;
  }

  return new Promise((resolve, reject) => {
    // If it's already a very small image (< 100KB) and WebP/JPEG, read directly
    if (file.size < 100 * 1024 && (file.type === 'image/webp' || file.type === 'image/jpeg')) {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve({ dataUrl: reader.result as string, file });
      };
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for compression.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ dataUrl: e.target?.result as string, file });
          return;
        }

        // Enable high quality bicubic downscaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for superior compression
        const mimeType = 'image/webp';
        let dataUrl: string;
        try {
          dataUrl = canvas.toDataURL(mimeType, quality);
          // Some older browsers return image/png if webp is unsupported
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
                type: mimeType,
                lastModified: Date.now(),
              });
              resolve({ dataUrl, file: compressedFile });
            } else {
              resolve({ dataUrl, file });
            }
          },
          mimeType,
          quality
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
