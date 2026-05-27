import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Share2,
  Copy,
  Check,
  Trash2,
  ChevronLeft,
  ChevronRight } from
'lucide-react';
import { GalleryImage } from '../types';
interface LightboxProps {
  image: GalleryImage | null;
  images?: GalleryImage[];
  onClose: () => void;
  onDelete?: (image: GalleryImage) => void;
  onNavigate?: (image: GalleryImage) => void;
  isViewMode: boolean;
}
export function Lightbox({
  image,
  images = [],
  onClose,
  onDelete,
  onNavigate,
  isViewMode
}: LightboxProps) {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  if (!image) return null;
  // Find current index for navigation
  const currentIndex = images.findIndex((img) => img.id === image.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;
  const goToPrev = () => {
    if (hasPrev && onNavigate) {
      onNavigate(images[currentIndex - 1]);
    }
  };
  const goToNext = () => {
    if (hasNext && onNavigate) {
      onNavigate(images[currentIndex + 1]);
    }
  };
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(image.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this photo',
          url: image.url
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      handleCopyLink();
    }
  };
  const handleDelete = () => {
    if (onDelete) {
      onDelete(image);
      onClose();
    }
  };
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);
  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
        onClick={onClose}>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-50 rounded-full p-2.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white">
          
          <X size={28} />
        </button>

        {/* Image counter */}
        {images.length > 1 &&
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/40 text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        }

        {/* Previous button */}
        {hasPrev &&
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full p-2.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white">
          
            <ChevronLeft size={32} />
          </button>
        }

        {/* Next button */}
        {hasNext &&
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full p-2.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white">
          
            <ChevronRight size={32} />
          </button>
        }

        <motion.div
          key={image.id}
          initial={{
            scale: 0.92,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          exit={{
            scale: 0.92,
            opacity: 0
          }}
          transition={{
            type: 'spring',
            damping: 28,
            stiffness: 320
          }}
          className="relative flex flex-col items-center px-16"
          onClick={(e) => e.stopPropagation()}>
          
          <img
            src={image.url}
            alt="Gallery full size"
            className="max-h-[82vh] max-w-[85vw] rounded-xl object-contain shadow-2xl" />
          

          {/* Action buttons */}
          <div className="mt-5 flex items-center gap-3 relative">
            {/* Delete button - only in owner mode */}
            {!isViewMode && onDelete &&
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-red-500/30 hover:text-red-300 border border-white/10">
              
                <Trash2 size={15} />
                Delete
              </button>
            }

            {/* Share button - only in owner mode (base64 URLs aren't useful to share for viewers) */}
            {!isViewMode &&
            <div className="relative">
                <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20 border border-white/10">
                
                  <Share2 size={16} />
                  Share
                </button>

                <AnimatePresence>
                  {showShareMenu &&
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                    scale: 0.95
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    scale: 0.95
                  }}
                  className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 w-48 overflow-hidden rounded-xl bg-[#1a1a24] border border-white/10 shadow-xl">
                  
                      <div className="flex flex-col p-1">
                        <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                      
                          {copied ?
                      <Check size={16} className="text-green-400" /> :

                      <Copy size={16} />
                      }
                          {copied ? 'Copied!' : 'Copy Image Link'}
                        </button>
                        {navigator.share &&
                    <button
                      onClick={handleNativeShare}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                      
                            <Share2 size={16} />
                            Share via...
                          </button>
                    }
                      </div>
                    </motion.div>
                }
                </AnimatePresence>
              </div>
            }
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>);

}