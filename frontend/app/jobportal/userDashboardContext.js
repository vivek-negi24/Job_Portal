'use client';

import { createContext, useContext, useState } from 'react';

// Create context
const UserDashboardContext = createContext();

// Create Provider
export function UserDashboardProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <UserDashboardContext.Provider value={{ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }}>
      {children}
    </UserDashboardContext.Provider>
  );
}

// Custom Hook
export function useUserDashboard() {
  return useContext(UserDashboardContext);
}
