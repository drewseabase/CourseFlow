'use client';

import { useAddEvent } from 'context/addEventContext';
import { useState } from 'react';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type EventType = 'work' | 'personal' | 'appointment' | 'other';

const TYPE_COLORS: Record<EventType, string> = {
  work: '#3b82f6',
  personal: '#16a34a',
  appointment: '#ea580c',
  other: '#7c3aed',
};

const EVENT_TYPES: { type: EventType; label: string; color: string; icon: React.ReactNode }[] = [
  {
    type: 'work',
    label: 'Work',
    color: '#3b82f6',
    icon: (
      <svg width="14" height="14" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
  {
    type: 'personal',
    label: 'Personal',
    color: '#16a34a',
    icon: (
      <svg width="14" height="14" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    type: 'appointment',
    label: 'Appt',
    color: '#ea580c',
    icon: (
      <svg width="14" height="14" fill="none" stroke="#ea580c" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="17" rx="2"/>
        <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round"/>
        <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    type: 'other',
    label: 'Other',
    color: '#7c3aed',
    icon: (
      <svg width="14" height="14" fill="none" stroke="#7c3aed" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round"/>
        <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
  const [selectedType, setSelectedType] = useState<EventType>('personal');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const {onEventAdded} = useAddEvent();

 const handleSubmit = async () => {
  console.log({ title, date, time, duration });
  if(!title || !date || !time || !duration) return;
  
  const startTime = new Date(`${date}T${time}`);
  const endTime = new Date(startTime.getTime() + parseInt(duration) * 60000);

  try {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        title,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        type: selectedType,
        color: TYPE_COLORS[selectedType],
        duration: parseInt(duration),
      }),
    });
    console.log('Response status:', res.status);
    const data = await res.json();
    console.log('Response data:', data);
  } catch (err) {
    console.error('Fetch error:', err);
  }

  onEventAdded?.();
  handleClose();
};

  const handleClose = () => {
    setTitle('');
    setDate('');
    setTime('');
    setDuration('');
    setSelectedType('personal');
    onClose();
  };

  const inputHover = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.50)';
      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.10)';
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = 'rgba(39,39,42,0.15)';
      e.currentTarget.style.boxShadow = 'none';
    },
  };

  const btnHover = {
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      >
        {/* Modal */}
        <div className="bg-zinc-100/97 border border-zinc-900/18 rounded-[20px] p-7 w-[min(440px,92vw)] shadow-[0_20px_60px_rgba(0,0,0,0.15)]">

          {/* Header */}
          <div className="flex items-start justify-between mb-1">
            <div className="text-[18px] font-extrabold text-zinc-900">Add Event</div>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-[7px] border-[1.5px] border-zinc-900/18 bg-white/75 text-zinc-500 flex items-center justify-center text-sm cursor-pointer transition-all duration-150"
              {...btnHover}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <p className="text-[12px] text-zinc-400 font-medium mb-5">
            Log something the AI wouldn't know about
          </p>

          {/* Type picker */}
          <div className="mb-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-400 mb-2">Type</div>
            <div className="grid grid-cols-4 gap-2">
              {EVENT_TYPES.map(({ type, label, color, icon }) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`
                    flex flex-col items-center gap-1.5 py-2 px-1 rounded-[10px] border-[1.5px] cursor-pointer transition-all duration-150 text-[11px] font-semibold
                    ${selectedType === type
                      ? 'border-violet-400/40 bg-violet-500/10 text-violet-700'
                      : 'border-zinc-900/14 bg-white/75 text-zinc-500 hover:bg-white/95 hover:text-zinc-900'
                    }
                  `}
                >
                  <div
                    className="w-7 h-7 rounded-[7px] flex items-center justify-center"
                    style={{ backgroundColor: `${color}1a` }}
                  >
                    {icon}
                  </div>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-3.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-400 mb-1.5">Title</div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Coffee with Sam"
              className="w-full px-3 py-2.5 rounded-[10px] border-[1.5px] border-zinc-900/15 bg-white/80 text-[13px] font-medium text-zinc-900 outline-none transition-all duration-150"
              style={{ fontFamily: 'inherit' }}
              {...inputHover}
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3 mb-3.5">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-400 mb-1.5">Date</div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-[10px] border-[1.5px] border-zinc-900/15 bg-white/80 text-[13px] font-medium text-zinc-900 outline-none transition-all duration-150"
                style={{ fontFamily: 'inherit' }}
                {...inputHover}
              />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-400 mb-1.5">Time</div>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-[10px] border-[1.5px] border-zinc-900/15 bg-white/80 text-[13px] font-medium text-zinc-900 outline-none transition-all duration-150"
                style={{ fontFamily: 'inherit' }}
                {...inputHover}
              />
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-400 mb-1.5">Duration (minutes)</div>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="60"
              min="15"
              step="15"
              className="w-full px-3 py-2.5 rounded-[10px] border-[1.5px] border-zinc-900/15 bg-white/80 text-[13px] font-medium text-zinc-900 outline-none transition-all duration-150"
              style={{ fontFamily: 'inherit' }}
              {...inputHover}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-[10px] border-[1.5px] border-zinc-900/18 bg-transparent text-zinc-500 text-[13px] font-semibold cursor-pointer transition-all duration-150"
              style={{ fontFamily: 'inherit' }}
              {...btnHover}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-2 py-2.5 rounded-[10px] border-[1.5px] border-violet-400/40 bg-violet-500/15 text-violet-700 text-[13px] font-bold cursor-pointer transition-all duration-150"
              style={{ fontFamily: 'inherit' }}
              {...btnHover}
            >
              Add Event
            </button>
          </div>

        </div>
      </div>
    </>
  );
}