let userConfig = undefined

try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
      }
    ]
  },
  experimental: {
    optimizeCss: true
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: 'standalone',
  // Remove unstable options that cause warnings
  // unstable_runtimeJS: true,
  // unstable_JsPreload: false,
  webpack: (config, { dev, isServer }) => {
    // Disable caching in development mode
    if (dev) {
      config.cache = false;
    }
    
    // Optimize client-side bundle
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }

    // Fix module resolution
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      },
    }

    // Add module aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': config.resolve.alias['@'] || './src',
    }

    // Ensure proper handling of dynamic imports
    config.module = {
      ...config.module,
      parser: {
        ...config.module.parser,
        javascript: {
          ...config.module.parser?.javascript,
          dynamicImports: true,
        },
      },
    }

    return config
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          // Add cache control headers to disable caching in development
          {
            key: 'Cache-Control',
            value: process.env.NODE_ENV === 'development' ? 'no-store, no-cache, must-revalidate, proxy-revalidate' : 'public, max-age=3600'
          },
          {
            key: 'Pragma',
            value: process.env.NODE_ENV === 'development' ? 'no-cache' : 'public'
          },
          {
            key: 'Expires',
            value: process.env.NODE_ENV === 'development' ? '0' : '3600'
          }
        ]
      }
    ]
  }
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return nextConfig
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
  return nextConfig
}

export default nextConfig
