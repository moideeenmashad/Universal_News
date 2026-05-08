'use client';

import { useEffect } from 'react';
import { GoX, GoSearch } from 'react-icons/go';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from './SearchBar';
import type { SearchModalProps } from '@/shared/types';

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-12 md:pt-24 px-4 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-full max-w-3xl relative z-10 overflow-hidden border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header matching image */}
            <div className="flex items-start justify-between p-8 pb-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary border border-gray-100 shadow-sm">
                  <GoSearch className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Universal Search</h2>
                  <p className="text-sm text-gray-400 font-medium mt-0.5">Find anything across all categories</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-full transition-all text-gray-300 hover:text-primary active:scale-90"
                aria-label="Close search"
              >
                <GoX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 pt-6">
              <SearchBar onClose={onClose} />
              
              <div className="mt-8 flex items-center justify-center gap-8 py-5 border-t border-gray-50/50">
                <div className="flex items-center gap-2.5 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  <span className="px-2 py-0.5 rounded-md border border-gray-200 bg-gray-50 text-gray-500 shadow-sm">Enter</span>
                  to select
                </div>
                <div className="flex items-center gap-2.5 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  <span className="px-2 py-0.5 rounded-md border border-gray-200 bg-gray-50 text-gray-500 shadow-sm">↑↓</span>
                  to navigate
                </div>
                <div className="flex items-center gap-2.5 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  <span className="px-2 py-0.5 rounded-md border border-gray-200 bg-gray-50 text-gray-500 shadow-sm">Esc</span>
                  to close
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

