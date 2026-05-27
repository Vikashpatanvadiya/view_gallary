import React, { lazy } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { GalleryImage } from '../types';
interface FloatingImageProps {
  image: GalleryImage;
  onClick: () => void;
  onDelete?: () => void;
  isPaused: boolean;
  index: number;
  isViewMode: boolean;
}
export function FloatingImage({
  image,
  onClick,
  onDelete,
  isPaused,
  index,
  isViewMode
}: FloatingImageProps) {
  const floatDuration = 4 + index % 5 * 0.8;
  const floatDelay = index % 7 * 0.3;
  const floatY = 6 + index % 3 * 3;
  return (
    <motion.div
      className="mb-3 break-inside-avoid cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] relative group"
      initial={{
        opacity: 0,
        scale: 0.92,
        y: 30
      }}
      animate={{
        opacity: isPaused ? 0.4 : 1,
        scale: 1,
        y: 0,
        filter: isPaused ? 'blur(1.5px)' : 'blur(0px)'
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.04
      }}
      whileHover={{
        scale: 1.03,
        zIndex: 20,
        boxShadow:
        '0 0 40px rgba(255, 255, 255, 0.15), 0 20px 60px rgba(0,0,0,0.5)'
      }}
      onClick={onClick}
      layout>
      
      {/* Delete button - only visible on hover, only in owner mode */}
      {!isViewMode && onDelete &&
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/70 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/80 hover:text-white backdrop-blur-sm"
        aria-label="Remove image">
        
          <Trash2 size={14} />
        </button>
      }

      {/* Subtle continuous float animation */}
      <motion.div
        animate={
        !isPaused ?
        {
          y: [-floatY / 2, floatY / 2, -floatY / 2]
        } :
        {
          y: 0
        }
        }
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: floatDelay
        }}>
        
        <img
          src={image.url}
          alt="Gallery"
          className="w-full h-auto block pointer-events-none"
          loading="lazy" />
        
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.04] transition-colors duration-300" />
      </motion.div>
    </motion.div>);

}