'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import AddEventModal from './addEventModal';
import { AddEventContext } from 'context/addEventContext';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const openAddEvent = () => { console.log('openAddEvent called'); setModalOpen(true)};
  const closeAddEvent = () => setModalOpen(false);

  return (
    <AddEventContext.Provider value={{ openAddEvent }}>
      <div className="min-h-screen flex">
        <Navbar onAddEvent={openAddEvent} />
        <main className="flex-1">
          {children}
        </main>
        <AddEventModal isOpen={modalOpen} onClose={closeAddEvent} />
      </div>
    </AddEventContext.Provider>
  );
}