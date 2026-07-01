
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FusionPay Sovereign OS',
    short_name: 'Sovereign OS',
    description: 'Deterministic infrastructure for digital civilizations',
    start_url: '/',
    display: 'standalone',
    background_color: '#13151a',
    theme_color: '#00f2ff',
    orientation: 'portrait',
    scope: '/',
    icons: [
      {
        src: '/icon',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: 'any',
        type: 'image/png',
      }
    ],
  };
}
