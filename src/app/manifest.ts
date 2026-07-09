
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FusionPay Sovereign OS',
    short_name: 'Sovereign OS',
    description: 'Deterministic infrastructure for digital civilizations',
    start_url: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'minimal-ui'],
    background_color: '#13151a',
    theme_color: '#00f2ff',
    orientation: 'any',
    scope: '/',
    categories: ['finance', 'productivity', 'utilities'],
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
