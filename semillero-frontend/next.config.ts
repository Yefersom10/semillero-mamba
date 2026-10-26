import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Genera .next/standalone con solo lo necesario para ejecutar (imagen Docker liviana)
  output: "standalone",
};

export default nextConfig;
