"use client";

import { createContext, useContext, useState } from 'react';

type NavbarContextType = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  navBarIsVisible: boolean;
  setNavBarIsVisible: (visible: boolean) => void;
  navBarHeightPx: number;
};

const NavbarContext = createContext<NavbarContextType>({
  mobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  navBarIsVisible: true,
  setNavBarIsVisible: () => {},
  navBarHeightPx: 80,
});

export function NavbarProvider({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navBarIsVisible, setNavBarIsVisible] = useState(true);

  const navBarHeightPx = 80;
  return (
    <NavbarContext.Provider value={{
      mobileMenuOpen,
      setMobileMenuOpen,
      navBarIsVisible,
      setNavBarIsVisible,
      navBarHeightPx
    }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbarContext() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbarContext must be used within a NavbarProvider');
  }
  return context;
}