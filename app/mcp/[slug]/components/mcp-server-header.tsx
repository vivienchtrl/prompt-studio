import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Clock, Github } from 'lucide-react'
import { McpServerType } from '@/lib/backend/validators/mcp-server.schemas'
import { ShareButtons } from './share-buttons'

interface McpServerHeaderProps {
  server: Partial<McpServerType> & { 
    name: string
    description?: string | null
    githubUrl?: string | null
    readme?: string | null
  }
  url: string
}

export function McpServerHeader({ server, url }: McpServerHeaderProps) {
  const calculateReadingTime = (text: string | undefined) => {
    if (!text) return 1
    const wordsPerMinute = 200
    const words = text.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  const readingTime = calculateReadingTime(server.readme || '')

  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-4">
          <Link href="/mcp">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">
            Home
          </Link>{' '}
          /{' '}
          <Link href="/mcp" className="hover:underline">
            MCP Servers
          </Link>{' '}
          / {server.name}
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-4">{server.name}</h1>
      
      {server.description && (
        <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
          {server.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-6 mb-8">
        <div className="flex items-center text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          <Clock className="h-4 w-4 mr-2" />
          {readingTime} min read
        </div>
        
        <ShareButtons 
          url={url} 
          title={server.name} 
          description={server.description} 
        />
      </div>

      {server.githubUrl && (
        <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-lg font-medium" asChild>
          <a
            href={server.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3"
          >
            <Github className="h-6 w-6" />
            View on GitHub
          </a>
        </Button>
      )}
    </div>
  )
}
