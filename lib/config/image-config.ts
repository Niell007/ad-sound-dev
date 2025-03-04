export const imagePresets = {
  thumbnail: {
    width: 150,
    height: 150,
    quality: 80,
    format: 'webp' as const
  },
  avatar: {
    width: 32,
    height: 32,
    quality: 90,
    format: 'webp' as const
  },
  preview: {
    width: 300,
    height: 300,
    quality: 85,
    format: 'webp' as const
  },
  hero: {
    width: 1920,
    height: 1080,
    quality: 90,
    format: 'webp' as const
  },
  gallery: {
    width: 800,
    height: 600,
    quality: 85,
    format: 'webp' as const
  },
  blog: {
    width: 1200,
    height: 630,
    quality: 85,
    format: 'webp' as const
  }
} as const

export type ImagePreset = keyof typeof imagePresets

export const defaultImageConfig = {
  domains: ['images.unsplash.com'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ['image/webp'],
  minimumCacheTTL: 60,
  dangerouslyAllowSVG: false,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.unsplash.com',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: '**.supabase.co',
      port: '',
      pathname: '/storage/v1/object/public/**',
    }
  ]
}