import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';
interface UploadButtonProps {
  onUpload: (files: FileList) => void | Promise<void>;
}
export function UploadButton({ onUpload }: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
      // Reset input so the same files can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange} />
      
      <motion.button
        whileHover={{
          scale: 1.1,
          backgroundColor: 'rgba(255, 255, 255, 0.15)'
        }}
        whileTap={{
          scale: 0.95
        }}
        onClick={() => fileInputRef.current?.click()}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] text-white transition-colors"
        aria-label="Upload images">
        
        <Upload size={24} />
      </motion.button>
    </div>);

}