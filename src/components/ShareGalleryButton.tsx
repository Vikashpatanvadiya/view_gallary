import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Check, Loader2 } from 'lucide-react';
import { GalleryImage } from '../types';
import { encodeGalleryData } from '../utils/galleryEncoder';
interface ShareGalleryButtonProps {
  images: GalleryImage[];
}
export function ShareGalleryButton({ images }: ShareGalleryButtonProps) {
  const [status, setStatus] = useState<
    'idle' | 'encoding' | 'copied' | 'error'>(
    'idle');
  const handleShareGallery = async () => {
    if (images.length === 0) return;
    setStatus('encoding');
    try {
      // Collect all image URLs (already base64 data URLs from compression)
      const urls = images.map((img) => img.url);
      const encoded = encodeGalleryData(urls);
      // Build the share URL with encoded data in hash
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set('mode', 'view');
      const shareUrl = `${url.toString()}#gallery=${encoded}`;
      // Try native share first
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Photo Gallery',
            text: 'Check out this photo gallery!',
            url: shareUrl
          });
          setStatus('idle');
          return;
        } catch (err) {

          // Fall through to copy
        }}
      await navigator.clipboard.writeText(shareUrl);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Failed to share', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };
  return (
    <div className="fixed bottom-8 left-8 z-40">
      <motion.button
        whileHover={{
          scale: 1.05
        }}
        whileTap={{
          scale: 0.95
        }}
        onClick={handleShareGallery}
        disabled={status === 'encoding'}
        className="flex items-center gap-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] text-white px-5 py-3 text-sm font-medium transition-colors hover:bg-white/15 disabled:opacity-50">
        
        <AnimatePresence mode="wait">
          {status === 'encoding' ?
          <motion.span
            key="encoding"
            initial={{
              opacity: 0,
              scale: 0.8
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.8
            }}
            className="flex items-center gap-2">
            
              <Loader2 size={18} className="animate-spin" />
              Generating Link...
            </motion.span> :
          status === 'copied' ?
          <motion.span
            key="copied"
            initial={{
              opacity: 0,
              scale: 0.8
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.8
            }}
            className="flex items-center gap-2">
            
              <Check size={18} className="text-green-400" />
              Link Copied!
            </motion.span> :
          status === 'error' ?
          <motion.span
            key="error"
            initial={{
              opacity: 0,
              scale: 0.8
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.8
            }}
            className="flex items-center gap-2 text-red-300">
            
              Too many photos to share via link
            </motion.span> :

          <motion.span
            key="share"
            initial={{
              opacity: 0,
              scale: 0.8
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.8
            }}
            className="flex items-center gap-2">
            
              <Link2 size={18} />
              Share Gallery
            </motion.span>
          }
        </AnimatePresence>
      </motion.button>
    </div>);

}