export default function robots() {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://prompt-studio.com').replace(/\/$/, '')
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/converter/',
          '/prompt-library/',
          '/studio/',
          '/mcp/',
          '/blog/',
        ],
        disallow: [
          '/api/',
          '/dashboard/',
          '/admin/',
          '/auth/',
          '/_next/static/',
          '/_next/image/',
        ],
      },
      // Specific rules for AI bots
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'Anthropic-Bot',
        allow: '/',
      },
      {
        userAgent: 'bingbot',
        allow: '/',
      },
      {
        userAgent: 'msnbot',
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'YouBot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
