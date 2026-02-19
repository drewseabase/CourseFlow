'use client';

import {createContext, useContext} from 'react';

interface AddEventContextType {
    openAddEvent: () => void;
};

export const AddEventContext = createContext<AddEventContextType>({
    openAddEvent: () => {},
});

export const useAddEvent = () => useContext(AddEventContext);
