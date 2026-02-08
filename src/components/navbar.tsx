'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Calendar', href: '/calendar' },
    { name: 'Courses', href: '/courses' },
    { name: 'Analytics', href: '/analytics' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="mx-auto max-w-4xl px-12 p-6 bg-[#FFFFFF] rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-[10px]">
      <div className="flex justify-between items-center">
        {/* Logo */}
        
        <h1 className="text-[32px] font-bold bg-linear-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            CourseFlow
        </h1>
        

        {/* Desktop Navigation Tabs */}
        <div className="items-center gap-2 bg-[#FAFAFA] p-1.5 rounded-xl">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
                ${
                  isActive(item.href)
                    ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-[#18181B]'
                    : `bg-transparent text-[#52525B] hover:bg-linear-to-r 
                    hover:from-[#667eea] hover:to-[#764ba2] hover:text-white hover:shadow-[0_4px_12px_rgba(102,126,234,0.35)]`
                }
              `}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            className="px-6 py-3 rounded-xl bg-linear-to-r from-[#667eea] to-[#764ba2] text-white font-semibold text-sm shadow-[0_4px_12px_rgba(102,126,234,0.4)] hover:shadow-[0_8px_20px_rgba(102,126,234,0.5)] hover:-translate-y-0.5 transition-all duration-300"
          >
            + Add Task
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#52525B] hover:text-[#18181B]"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-[#E4E4E7]">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200
                  ${
                    isActive(item.href)
                      ? 'bg-[#FAFAFA] text-[#18181B]'
                      : 'text-[#52525B] hover:bg-[#FAFAFA] hover:text-[#18181B]'
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
            <button
              className="mt-2 px-4 py-3 rounded-xl bg-linear-to-r from-[#667eea] to-[#764ba2] text-white font-semibold text-sm shadow-[0_4px_12px_rgba(102,126,234,0.4)]"
            >
              + Add Task
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}