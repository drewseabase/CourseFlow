'use client';

import { useState, useRef } from 'react';
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar';
import AddEventModal from './addEventModal';
import { AddEventContext } from 'context/addEventContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);
  const onEventAddedRef = useRef<(() => void) | undefined>(undefined);
  const pathname = usePathname();

  const openAddEvent = () => setModalOpen(true);
  const closeAddEvent = () => setModalOpen(false);

  const setOnEventAdded = (fn: () => void) => {
    onEventAddedRef.current = fn;
  };

  const onEventAdded = () => {
    onEventAddedRef.current?.();
  };

  // Pages where the Navbar should NOT appear
  const hideNavbar = ['/login', '/signup', '/'].includes(pathname);

  return (
    <AddEventContext.Provider value={{ openAddEvent, onEventAdded, setOnEventAdded }}>
      <div className="min-h-screen flex">
        {!hideNavbar && <Navbar onAddEvent={openAddEvent} />}
        <main className="flex-1">
          {children}
        </main>
        {!hideNavbar && <AddEventModal isOpen={modalOpen} onClose={closeAddEvent} />}
      </div>
    </AddEventContext.Provider>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LayoutContent>{children}</LayoutContent>
    </SessionProvider>
  );
}