'use client';

import {createContext, useContext} from 'react';

interface AddEventContextType {
    openAddEvent: () => void;
    onEventAdded?: () => void;
    setOnEventAdded: (fn: () => void) => void;
};

export const AddEventContext = createContext<AddEventContextType>({
    openAddEvent: () => {},
    setOnEventAdded: () => {},
});

export const useAddEvent = () => useContext(AddEventContext);
