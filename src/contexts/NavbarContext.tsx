"use client";

import { createContext, useContext, useState } from 'react';

// Define the shape of the context
type NavbarContextType = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
};

// Create the context with a default value
const NavbarContext = createContext<NavbarContextType>({
  mobileMenuOpen: false,
  setMobileMenuOpen: () => {},
});

// Create a provider component
export function NavbarProvider({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <NavbarContext.Provider value={{ mobileMenuOpen, setMobileMenuOpen }}>
      {children}
    </NavbarContext.Provider>
  );
}

// Create a custom hook to use the context
export function useNavbarContext() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbarContext must be used within a NavbarProvider');
  }
  return context;
}