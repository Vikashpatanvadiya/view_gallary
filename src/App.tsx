import React, { useEffect, useMemo, useState } from 'react';
import { GalleryImage } from './types';
import { FloatingGallery } from './components/FloatingGallery';
import { Lightbox } from './components/Lightbox';
import { UploadButton } from './components/UploadButton';
import { ShareGalleryButton } from './components/ShareGalleryButton';
import { ViewModeBanner } from './components/ViewModeBanner';
import { compressImage, decodeGalleryData } from './utils/galleryEncoder';
export function App() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Detect view-only mode from URL params
  const isViewMode = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'view';
  }, []);
  // On mount, check if there's gallery data in the URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('gallery=')) {
      const encoded = hash.split('gallery=')[1];
      if (encoded) {
        const urls = decodeGalleryData(encoded);
        if (urls.length > 0) {
          const loadedImages: GalleryImage[] = urls.map((url, i) => ({
            id: `shared-${i}`,
            url
          }));
          setImages(loadedImages);
        }
      }
    }
    setIsLoading(false);
  }, []);
  // Upload handler: compress images to base64 data URLs (not blob URLs)
  const handleUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    // Process files in parallel with compression
    const compressed = await Promise.all(
      fileArray.map((file) => compressImage(file, 800, 0.65))
    );
    const newImages: GalleryImage[] = compressed.map((dataUrl, i) => ({
      id: `upload-${Date.now()}-${i}-${Math.random()}`,
      url: dataUrl
    }));
    setImages((prev) => [...prev, ...newImages]);
  };
  const handleDelete = (image: GalleryImage) => {
    setImages((prev) => prev.filter((img) => img.id !== image.id));
  };
  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#08080f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>);

  }
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#08080f] text-white font-sans selection:bg-white/30">
      {/* Background noise texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay bg-noise z-10" />

      {/* Radial gradient for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] z-10" />

      {/* View mode banner */}
      {isViewMode && <ViewModeBanner />}

      {/* Empty state */}
      {images.length === 0 && !isViewMode &&
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <p className="text-white/30 text-lg font-medium mb-2">
            No photos yet
          </p>
          <p className="text-white/20 text-sm">
            Click the upload button to add your photos
          </p>
        </div>
      }

      {images.length === 0 && isViewMode &&
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <p className="text-white/30 text-lg font-medium">
            No photos in this gallery
          </p>
        </div>
      }

      <FloatingGallery
        images={images}
        onImageClick={setSelectedImage}
        onImageDelete={isViewMode ? undefined : handleDelete}
        isPaused={selectedImage !== null}
        isViewMode={isViewMode} />
      

      {/* Upload & Share buttons - only in owner mode */}
      {!isViewMode && <UploadButton onUpload={handleUpload} />}
      {!isViewMode && images.length > 0 &&
      <ShareGalleryButton images={images} />
      }

      {selectedImage &&
      <Lightbox
        image={selectedImage}
        images={images}
        onClose={() => setSelectedImage(null)}
        onDelete={isViewMode ? undefined : handleDelete}
        onNavigate={setSelectedImage}
        isViewMode={isViewMode} />

      }
    </div>);

}