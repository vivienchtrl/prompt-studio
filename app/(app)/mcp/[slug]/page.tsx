import { McpServerService } from '@/lib/backend/services/mcp-server.service'
import { Footer } from '@/components/navigation/footer'
import { Navbar1 } from '@/components/navigation/nav-bar'
import { notFound } from 'next/dist/client/components/not-found'
import { Metadata } from 'next'
import { SoftwareApplicationSchema } from '@/components/seo/SoftwareApplicationSchema'
import { FAQSchema } from '@/components/seo/FAQSchema'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { cache } from 'react'
import { McpServerHeader } from './components/mcp-server-header'
import { McpServerInfo } from './components/mcp-server-info'
import { McpReadme } from './components/mcp-readme'
import { RelatedServers } from './components/related-servers'
import { McpFaq } from './components/mcp-faq'

type McpServerDetailsPageProps = {
  params: Promise<{
    slug: string
  }>
}

// Cache the data fetch to avoid duplicate DB calls between generateMetadata and page component
const getMcpServer = cache(async (slug: string) => {
  const service = new McpServerService()
  return service.findBySlug(slug)
})

export async function generateMetadata({ params }: McpServerDetailsPageProps): Promise<Metadata> {
  const { slug } = await params
  const server = await getMcpServer(slug)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://prompt-studio.com'
  
  if (!server) {
    return {
      title: 'MCP Server Not Found',
    }
  }

  return {
    title: `${server.name} - MCP Server`,
    description: server.description,
    keywords: server.tags,
    openGraph: {
      title: `${server.name} - MCP Server`,
      description: server.description || '',
      type: 'website',
      url: `${baseUrl}/mcp/${slug}`,
      siteName: 'Prompt Studio',
      images: [
        {
          url: '/media/logo.png', // Fallback image, ideally should be dynamic if server has an image
          width: 1200,
          height: 630,
          alt: server.name,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: server.name,
      description: server.description || '',
      images: ['/media/logo.png'],
    }
  }
}

export default async function McpServerDetailsPage({ params }: McpServerDetailsPageProps) {
  const service = new McpServerService()
  const { slug } = await params
  
  // Parallelize data fetching
  const [server, relatedServers] = await Promise.all([
    getMcpServer(slug),
    service.findRelated(3)
  ])

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://prompt-studio.com'

  if (!server) {
    return notFound()
  }

  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}` },
    { name: 'MCP Servers', url: `${baseUrl}/mcp` },
    { name: server?.name || '', url: `${baseUrl}/mcp/${slug}` }
  ]

  // Prepare FAQ data if exists
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faqItems = (Array.isArray(server.faq) ? server.faq : []) as { question: string; answer: string }[]

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <BreadcrumbSchema items={breadcrumbItems} />
        <SoftwareApplicationSchema 
          name={server.name}
          description={server.description || ''}
          applicationCategory={server.category}
          url={`${baseUrl}/mcp/${slug}`}
          datePublished={server.createdAt?.toISOString()}
          dateModified={server.updatedAt?.toISOString()}
          offers={{ price: '0', priceCurrency: 'USD' }}
        />
        {faqItems.length > 0 && <FAQSchema faqs={faqItems} />}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <McpServerHeader server={server} url={`${baseUrl}/mcp/${slug}`} />
            <McpServerInfo server={server} />
            <McpReadme readme={server.readme} />
            <McpFaq faqs={faqItems} />
          </div>

          {/* Sidebar Column - Related Tools */}
          <RelatedServers 
            servers={relatedServers} 
            currentServerId={server.id} 
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
