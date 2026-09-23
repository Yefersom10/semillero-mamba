'use client';

import { createContext } from 'react';

export interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  isLoading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  logout: () => {},
});