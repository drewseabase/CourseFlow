'use client';

import { useState, useRef } from 'react';
import {SessionProvider} from "next-auth/react";
import Navbar from '@/components/navbar';
import AddEventModal from './addEventModal';
import { AddEventContext } from 'context/addEventContext';
import { Session } from 'inspector/promises';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);
  const onEventAddedRef = useRef<(() => void) | undefined>(undefined);

  const openAddEvent = () => setModalOpen(true);
  const closeAddEvent = () => setModalOpen(false);

  const setOnEventAdded = (fn: () => void) => {
    onEventAddedRef.current = fn;
  };

  const onEventAdded = () => {
    onEventAddedRef.current?.();
  };

  return (
    <SessionProvider>
      <AddEventContext.Provider value={{ openAddEvent, onEventAdded, setOnEventAdded }}>
        <div className="min-h-screen flex">
          <Navbar onAddEvent={openAddEvent} />
          <main className="flex-1">
            {children}
          </main>
          <AddEventModal isOpen={modalOpen} onClose={closeAddEvent} />
        </div>
      </AddEventContext.Provider>
    </SessionProvider>
  );
}