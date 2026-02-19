'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavbarProps {
  onAddEvent: () => void;
}

export default function Navbar({ onAddEvent }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('sidebarOpen') === 'true';
  });

  const toggleMenu = () => {
    setMobileMenuOpen(prev => {
      localStorage.setItem('sidebarOpen', String(!prev));
      return !prev;
    });
  };

  const isActive = (href: string) => pathname === href;

  const addBtnHover = {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translate(-1px, -1px)';
      e.currentTarget.style.boxShadow = '2px 2px 0px 0px #18181B';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translate(0, 0)';
      e.currentTarget.style.boxShadow = 'none';
    },
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'translate(0, 0)';
      e.currentTarget.style.boxShadow = 'none';
    },
  };

  return (
    <aside
      className={[
        'fixed left-0 top-0 bottom-0 z-40',
        mobileMenuOpen ? 'w-40 px-2 py-4' : 'w-20 p-4',
        'bg-zinc-200/85 backdrop-blur-md',
        'border border-stone-400/70',
        'shadow-sm',
        'flex flex-col gap-3',
        'transition-all duration-200',
      ].join(' ')}
    >
      {/* Toggle NavBar */}
      <button
        onClick={toggleMenu}
        className={[
          'w-full h-8 rounded-4xl mt-2',
          'flex items-center',
          mobileMenuOpen ? 'justify-between px-2.5' : 'justify-center',
          'border border-zinc-200/70',
          'hover:bg-zinc-300 hover:border hover:border-stone-400/70 transition-all duration-200',
          'overflow-hidden',
        ].join(' ')}
        aria-label="Toggle Sidebar"
        title="Toggle Sidebar"
      >
        {mobileMenuOpen && (
          <span className="text-sm font-bold text-zinc-800 tracking-wide whitespace-nowrap pl-1">
            Cadence
          </span>
        )}

        <svg
          className="w-5.5 h-5.5 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          {(() => {
            const leftStart = 4;
            const rightEnd = 20;

            const topLength = 16;
            const midLength = 12;
            const botLength = 9;

            const topX1 = mobileMenuOpen ? rightEnd - topLength : leftStart;
            const topX2 = mobileMenuOpen ? rightEnd : leftStart + topLength;

            const midX1 = mobileMenuOpen ? rightEnd - midLength : leftStart;
            const midX2 = mobileMenuOpen ? rightEnd : leftStart + midLength;

            const botX1 = mobileMenuOpen ? rightEnd - botLength : leftStart;
            const botX2 = mobileMenuOpen ? rightEnd : leftStart + botLength;

            return (
              <>
                <line x1={topX1} y1="6"  x2={topX2} y2="6"  strokeLinecap="round" className="transition-all duration-200" />
                <line x1={midX1} y1="12" x2={midX2} y2="12" strokeLinecap="round" className="transition-all duration-200" />
                <line x1={botX1} y1="18" x2={botX2} y2="18" strokeLinecap="round" className="transition-all duration-200" />
              </>
            );
          })()}
        </svg>
      </button>

      {/* Add Event Button */}
      <button
        onClick={onAddEvent}
        className={[
          'w-full h-8 rounded-[10px]',
          'flex items-center',
          mobileMenuOpen ? 'justify-between px-2.5' : 'justify-center',
          'border-[1.5px] border-violet-400/35 bg-violet-500/10 text-violet-700',
          'cursor-pointer transition-all duration-150',
          'overflow-hidden',
        ].join(' ')}
        aria-label="Add Event"
        title="Add Event"
        {...addBtnHover}
      >
        {mobileMenuOpen && (
          <span className="text-sm font-bold text-violet-700 whitespace-nowrap pl-1">
            Add Event
          </span>
        )}
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          strokeLinecap="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      <nav className='flex flex-col gap-2.5'>
        {/* Dashboard */}
        <Link href="/dashboard" className={['w-full h-8 rounded-2xl', 'flex items-center', mobileMenuOpen ? 'justify-between px-2.5' : 'justify-center',
          'transition-all duration-200', 'overflow-hidden', isActive('/dashboard') ? 'bg-zinc-300 text-zinc-900' : 'text-zinc-900 hover:bg-zinc-300 hover:text-zinc-900',
          ].join(' ')} aria-label='Dashboard' title='Dashboard'>
          {mobileMenuOpen && (
            <span className="text-sm font-semibold text-zinc-800 whitespace-nowrap pl-1">Dashboard</span>
          )}
          <svg className="w-5.5 h-5.5 shrink-0 mr-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </Link>

        {/* Calendar */}
        <Link href='/calendar' className={['w-full h-8 rounded-2xl', 'flex items-center', mobileMenuOpen ? 'justify-between px-2.5' : 'justify-center',
          'transition-all duration-200', 'overflow-hidden', isActive('/calendar') ? 'bg-zinc-300 text-zinc-900' : 'text-zinc-900 hover:bg-zinc-300 hover:text-zinc-900',
          ].join(' ')} aria-label='Calendar' title='Calendar'>
          {mobileMenuOpen && (
            <span className='text-sm font-semibold text-zinc-800 whitespace-nowrap pl-1'>Calendar</span>
          )}
          <svg className='w-6 h-6 shrink-0 mr-0' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
            <rect x='3' y='4' width='18' height='17' rx='2'></rect>
            <line x1='8' y1='2' x2='8' y2='6'></line>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </Link>

        {/* Courses */}
        <Link href='/courses' className={['w-full h-8 rounded-2xl', 'flex items-center', mobileMenuOpen ? 'justify-between px-2.5' : 'justify-center',
          'transition-all duration-200', 'overflow-hidden', isActive('/courses') ? 'bg-zinc-300 text-zinc-900' : 'text-zinc-900 hover:bg-zinc-300 hover:text-zinc-900',
          ].join(' ')} aria-label='Courses' title='Courses'>
          {mobileMenuOpen && (
            <span className='text-sm font-semibold text-zinc-800 whitespace-nowrap pl-1'>Courses</span>
          )}
          <svg className='w-6.5 h-6.5 shrink-0 mr-0' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
            <path d='M3 10 L12 5 L21 10 L12 15 Z'></path>
            <path d='M7 13 V16 C7 17.5 10 19 12 19 C14 19 17 17.5 17 16 V13'></path>
            <line x1='21' y1='10' x2='21' y2='17'></line>
            <circle cx='21' cy='18.5' r='1.8' fill='currentColor' stroke='none'></circle>
          </svg>
        </Link>

        {/* Analytics */}
        <Link href='/analytics' className={['w-full h-8 rounded-2xl', 'flex items-center', mobileMenuOpen ? 'justify-between px-2.5' : 'justify-center',
          'transition-all duration-200', 'overflow-hidden', isActive('/analytics') ? 'bg-zinc-300 text-zinc-900' : 'text-zinc-900 hover:bg-zinc-300 hover:text-zinc-900',
          ].join(' ')} aria-label='Analytics' title='Analytics'>
          {mobileMenuOpen && (
            <span className='text-sm font-semibold text-zinc-800 whitespace-nowrap pl-1'>Analytics</span>
          )}
          <svg className='w-7 h-7 shrink-0 mr-0' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
            <path d='M4 16 L9 11 L13 13 L20 6'></path>
            <circle cx="4" cy="16" r="1.5" fill="currentColor" stroke="none"></circle>
            <circle cx="20" cy="6" r="1.5" fill="currentColor" stroke="none"></circle>
          </svg>
        </Link>
      </nav>
    </aside>
  );
}

