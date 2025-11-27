import { db } from '@/db'
import { mcpServers, templates } from '@/db/schema'
import { isNotNull } from 'drizzle-orm'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://prompt-studio.com'

  // Static routes
  const routes = [
    '',
    '/mcp',
    '/prompt-library',
    '/converter',
    '/converter/json-to-markdown',
    '/converter/json-to-toon',
    '/converter/json-to-xml',
    '/converter/json-to-yaml',
    '/converter/markdown-to-json',
    '/converter/markdown-to-toon',
    '/converter/markdown-to-xml',
    '/converter/markdown-to-yaml',
    '/converter/toon-to-json',
    '/converter/toon-to-markdown',
    '/converter/toon-to-xml',
    '/converter/toon-to-yaml',
    '/converter/xml-to-json',
    '/converter/xml-to-markdown',
    '/converter/xml-to-toon',
    '/converter/xml-to-yaml',
    '/converter/yaml-to-json',
    '/converter/yaml-to-markdown',
    '/converter/yaml-to-toon',
    '/converter/yaml-to-xml',
  ]

  const staticEntries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))

  // MCP Servers
  const mcpServerEntries = await db.select({
    slug: mcpServers.slug,
    updatedAt: mcpServers.updatedAt,
  })
  .from(mcpServers)
  .where(isNotNull(mcpServers.slug))

  const mcpEntries = mcpServerEntries
    .filter((server) => server.slug)
    .map((server) => ({
      url: `${baseUrl}/mcp/${server.slug}`,
      lastModified: server.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

  // Prompt Library (Templates)
  const templateEntries = await db.select({
    slug: templates.slug,
    updatedAt: templates.updatedAt,
  })
  .from(templates)
  .where(isNotNull(templates.slug))

  const promptEntries = templateEntries
    .filter((template) => template.slug)
    .map((template) => ({
      url: `${baseUrl}/prompt-library/${template.slug}`,
      lastModified: template.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

  return [...staticEntries, ...mcpEntries, ...promptEntries]
}
