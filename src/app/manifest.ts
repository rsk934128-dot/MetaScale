
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sovereign OS',
    short_name: 'Sovereign',
    description: 'Deterministic infrastructure for digital civilizations',
    start_url: '/',
    display: 'standalone',
    background_color: '#13151a',
    theme_color: '#00f2ff',
    icons: [
      {
        src: '/icon',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
