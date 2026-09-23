import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import './style.css';

export const metadata: Metadata = {
  title: 'Semillero MAMBA - CORHUILA',
  description: 'Plataforma del Semillero de Investigación MAMBA',
  icons: {
    icon: '/Logo/Logo-MAMBA-32x32.png',
    shortcut: '/Logo/Logo-MAMBA-16x16.png',
    apple: '/Logo/Logo-MAMBA-180x180.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}