import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GalleryImage } from '../types';
import { FloatingImage } from './FloatingImage';
interface FloatingGalleryProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage) => void;
  onImageDelete?: (image: GalleryImage) => void;
  isPaused: boolean;
  isViewMode: boolean;
}
export function FloatingGallery({
  images,
  onImageClick,
  onImageDelete,
  isPaused,
  isViewMode
}: FloatingGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({
    x: 0,
    y: 0
  });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseRef.current = {
        x,
        y
      };
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${x * -8}px, ${y * -6}px, 0)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return (
    <div className="fixed inset-0 overflow-auto scrollbar-hide z-20">
      <motion.div
        ref={containerRef}
        className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 p-3 will-change-transform"
        style={{
          transition: 'transform 0.3s ease-out'
        }}
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          duration: 0.8
        }}>
        
        {images.map((image, index) =>
        <FloatingImage
          key={image.id}
          image={image}
          onClick={() => onImageClick(image)}
          onDelete={onImageDelete ? () => onImageDelete(image) : undefined}
          isPaused={isPaused}
          index={index}
          isViewMode={isViewMode} />

        )}
      </motion.div>
    </div>);

}