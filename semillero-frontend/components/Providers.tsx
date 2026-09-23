'use client';

import { AuthProvider } from '@/AuthContext/AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}