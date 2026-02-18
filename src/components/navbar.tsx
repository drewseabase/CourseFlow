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
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
            CourseFlow
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

          <nav className='flex flex-col gap-1'>
            {/*DashBoard*/}
            <Link href="/dashboard" className={['w-full h-8 rounded-2xl', 'flex items-center', mobileMenuOpen ? 'justify-between px-2.5' : 'justify-center',
              'transition-all duration-200', 'overflow-hidden', isActive('/dashboard') ? 'bg-zinc-300 text-zinc-900' : 'text-zinc-600 hover:bg-zinc-300 hover:text-zinc-900',
              ].join(' ')}>

              {mobileMenuOpen && (
                  <span className="text-sm font-semibold text-zinc-800 whitespace-nowrap pl-1">
                    Dashboard
                  </span>
                )}

                <svg
                  className="w-5 h-5 shrink-0 mr-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </Link>
          </nav>
    </aside>
  );
}

