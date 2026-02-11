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
        // Position + size
        'fixed left-0 top-20 bottom-20 z-40',
        mobileMenuOpen ? 'w-21 px-2 py-4' : 'w-65 p-4',

        'bg-white/85 backdrop-blur-md',
        'border border-zinc-200/70',
        'rounded-r-3xl',
        'shadow-sm',

        // Layout
        'flex flex-col gap-3',
      ].join(' ')}
    >
      {/* Primary action (ONLY gradient button in the sidebar) */}
      <div className="flex items-center justify-center">
        <button
          className={[
            'w-full rounded-2xl px-4 py-3',
            'bg-linear-to-r from-[#667eea] to-[#764ba2] text-white',
            'font-semibold text-sm',
            'shadow-[0_6px_18px_rgba(102,126,234,0.22)]',
            'hover:shadow-[0_10px_26px_rgba(102,126,234,0.30)]',
            'hover:-translate-y-0.5 transition-all duration-200',
          ].join(' ')}
        >
          {mobileMenuOpen ? '+' : '+ Add Task'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              'rounded-2xl px-3 py-2.5',
              'text-sm font-semibold',
              'transition-all duration-200',

              // Collapsed state
              mobileMenuOpen ? 'px-0 flex justify-center' : '',

              // Active vs default vs hover
              isActive(item.href)
                ? 'bg-zinc-100 text-zinc-900'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
            ].join(' ')}
          >
            {mobileMenuOpen ? <span className="text-xl leading-none">•</span> : item.name}
          </Link>
        ))}
      </nav>

      {/* Filters */}
      <div className="mt-auto flex flex-col gap-2 text-zinc-600">
        {!mobileMenuOpen && (
          <small className="text-xs font-medium tracking-wide text-zinc-500 px-1">
            Filters
          </small>
        )}

        <label className={['flex items-center gap-2', mobileMenuOpen ? 'justify-center' : 'px-1'].join(' ')}>
          <input type="checkbox" defaultChecked className="accent-[#667eea]" />
          {!mobileMenuOpen && <span className="text-sm">Classes</span>}
        </label>

        <label className={['flex items-center gap-2', mobileMenuOpen ? 'justify-center' : 'px-1'].join(' ')}>
          <input type="checkbox" defaultChecked className="accent-[#667eea]" />
          {!mobileMenuOpen && <span className="text-sm">Work</span>}
        </label>

        <label className={['flex items-center gap-2', mobileMenuOpen ? 'justify-center' : 'px-1'].join(' ')}>
          <input type="checkbox" defaultChecked className="accent-[#667eea]" />
          {!mobileMenuOpen && <span className="text-sm">Personal</span>}
        </label>
      </div>

      {/* Collapse toggle (neutral button) */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={[
          'mt-3 w-full h-11 rounded-2xl',
          'border border-zinc-200/70',
          'bg-zinc-100 text-zinc-800',
          'hover:bg-zinc-200 transition-all duration-200',
          'font-semibold',
        ].join(' ')}
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
      >
        ☰
      </button>
    </aside>
  );
}

