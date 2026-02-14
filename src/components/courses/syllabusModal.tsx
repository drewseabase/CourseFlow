'use client';

import { useEffect } from "react";

interface SyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
}

export default function SyllabusModal({ isOpen, onClose, courseName }: SyllabusModalProps) {

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.15)] max-w-md w-full pointer-events-auto transform transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E4E4E7] flex justify-between items-start">
            <div>
              <h2 className="text-[24px] font-bold text-[#18181B]">{courseName}</h2>
              <p className="text-[14px] text-[#52525B] mt-1">Course Syllabus</p>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-[10px] bg-[#FAFAFA] hover:bg-[#E4E4E7] transition-all duration-200 flex items-center justify-center text-[#52525B] hover:text-[#18181B] text-xl font-bold"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-12 text-center">
            <div className="text-[64px] mb-4">🚀</div>
            <div className="text-[24px] font-bold text-[#18181B] mb-3">Feature Coming Soon!</div>
            <div className="text-[15px] text-[#52525B] leading-relaxed">
              Syllabus viewing is currently under development. Check back soon to access your course syllabus, learning objectives, and grading policies.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}