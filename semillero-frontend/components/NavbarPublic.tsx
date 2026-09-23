'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
  { href: '/#inicio', label: 'Inicio' },
  { href: '/#lineas', label: 'Líneas' },
  { href: '/#coordinadores', label: 'Equipo' },
  { href: '/#eventos', label: 'Eventos' },
  { href: '/#blog', label: 'Blog' },
  { href: '/login', label: 'Iniciar sesión' },
  { href: '/register', label: 'Registrarse' },
];

export default function NavbarPublic() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar-public-header">
      <div className="header-content">
        {/* LOGO + TITULO */}
        <Link href="/#inicio" className="logo-section" onClick={() => setMenuOpen(false)}>
          <div className="logo-item">
            <Image
              src="/Logo/Logo.png"
              className="logo-main"
              alt="Logo Mamba"
              width={50}
              height={50}
              priority
            />
            </div>
        </Link>

        {/* BOTÓN HAMBURGUESA (MÓVIL) */}
        <button
          className="navbar-mobile-toggle"
          id="navbar-toggle"
          aria-label="Menú"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* NAVEGACIÓN Y ACCIONES */}
        <nav className={`nav-menu ${menuOpen ? 'active' : ''}`} id="nav-menu">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}