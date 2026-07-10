/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Desliga a otimização de imagem do Next/Vercel.
    // Os desenhos são line art (PNG/JPG leves) servidos pelo Supabase,
    // que é gratuito e ilimitado. A otimização do Vercel quase não agrega
    // para line art e consumia a cota (erro 402 PAYMENT_REQUIRED).
    // Servindo direto: custo zero de otimização, sem limite de imagens.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zoffnfpjwpfzqcxlfqad.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;

