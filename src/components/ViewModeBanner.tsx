import React from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
export function ViewModeBanner() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-5 py-2.5 text-sm text-white/60 pointer-events-none">
      
      <Eye size={16} />
      View Only — Click any photo to view
    </motion.div>);

}