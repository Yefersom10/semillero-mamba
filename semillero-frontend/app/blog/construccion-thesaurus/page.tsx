'use client';

import React from 'react';
import Link from 'next/link';

export default function ConstruccionThesaurusPage() {
  return (
    <div className="bg-white font-sans text-gray-800 leading-relaxed min-h-screen flex flex-col">
      <main className="container mx-auto px-6 py-16 max-w-3xl flex-1">
        <Link href="/" className="text-[#1a7c5e] font-semibold hover:underline">
          ← Volver al inicio
        </Link>

        <article className="mt-8">
          <span className="inline-block bg-[#e8f5f0] text-[#1a7c5e] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Investigación
          </span>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-2">
            Construcción del Thesaurus sobre Investigación
          </h1>

          <p className="text-gray-500 mb-6">Por: Coordinadores del semillero</p>

          <div className="border-l-4 border-[#f59e0b] bg-[#fffbeb] text-[#78350f] p-4 rounded-r-lg mb-6">
            <p className="m-0 text-sm">
              🚧 <strong>Artículo en construcción.</strong> Estamos preparando este contenido
              para el blog del Semillero Mamba.
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed text-justify">
            Descubre cómo construimos un vocabulario controlado unificado para normalizar la
            terminología de nuestras investigaciones. Esta entrada publicará pronto el proceso,
            los criterios de selección de términos y las fuentes consultadas para la
            construcción del thesaurus del semillero.
          </p>
        </article>
      </main>
    </div>
  );
}
