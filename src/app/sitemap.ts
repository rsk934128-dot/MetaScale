
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sko-v1.vercel.app'
  
  const routes = [
    '',
    '/dashboard',
    '/finance',
    '/corridor',
    '/ubil',
    '/infrastructure',
    '/profile',
    '/legal',
    '/pricing',
    '/roadmap',
    '/intelligence',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
}
