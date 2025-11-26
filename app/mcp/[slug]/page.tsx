import { McpServerService } from '@/lib/backend/services/mcp-server.service'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Github } from 'lucide-react'
import { MarkdownProcessor } from './components/MarkdownProcessor'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { Footer } from '@/components/navigation/footer'
import { Navbar1 } from '@/components/navigation/nav-bar'
import { notFound } from 'next/dist/client/components/not-found'
import { Metadata } from 'next'
import { SoftwareApplicationSchema } from '@/components/seo/SoftwareApplicationSchema'
import { FAQSchema } from '@/components/seo/FAQSchema'
import { cache } from 'react'

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
  const faqItems = (Array.isArray(server.faq) ? server.faq : []) as any[]

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
      
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-4">
          <Link href="/mcp">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
           <div className="text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:underline">Home</Link> / <Link href="/mcp" className="hover:underline">MCP Servers</Link> / {server.name}
           </div>
           <h1 className="text-4xl font-bold">{server.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{server.name}</CardTitle>
                  <CardDescription className="text-base">{server.description}</CardDescription>
                </div>
                {server.githubUrl && (
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={server.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View on GitHub"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Category & Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-sm py-1 px-3">
                    {server.category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </Badge>
                  {server.tags && server.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {server.about && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground leading-relaxed">{server.about}</p>
                </div>
              )}

              {server.features && server.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Features</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {server.features.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {server.readme && (
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <MarkdownProcessor content={server.readme} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Column - Related Tools */}
        <div className="space-y-6">
          <div className="lg:sticky lg:top-6">
            <h2 className="text-xl font-semibold mb-4">Related Tools</h2>
            <div className="space-y-4">
              {relatedServers.filter(s => s.id !== server.id).map((related) => (
                <Card key={related.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Link href={`/mcp/${related.slug || related.id}`} className="block group">
                      <h3 className="font-semibold group-hover:text-primary transition-colors mb-2">
                        {related.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {related.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {related.category.split('_')[0]}
                        </Badge>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
              {relatedServers.filter(s => s.id !== server.id).length === 0 && (
                 <p className="text-muted-foreground text-sm">No related tools found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  )
}
