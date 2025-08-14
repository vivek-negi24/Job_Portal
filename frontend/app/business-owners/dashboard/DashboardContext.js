'use client';

import { createContext, useContext, useState } from 'react';

// Create Context
const DashboardContext = createContext();

// Create Provider
export function DashboardProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <DashboardContext.Provider value={{ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }}>
      {children}
    </DashboardContext.Provider>
  );
}

// Create a custom hook
export function useDashboard() {
  return useContext(DashboardContext);
}
