'use client'

import { McpServerType } from '@/lib/backend/validators/mcp-server.schemas'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// @ts-ignore - useRouter exists in next/navigation but TS is confused
import { useRouter } from 'next/navigation'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface McpServerCardProps {
  server: McpServerType
}

export function McpServerCard({ server }: McpServerCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/mcp/${server.slug || server.id}`)
  }

  return (
    <Card 
      className="h-full flex flex-col hover:shadow-md transition-all hover:border-primary/50 cursor-pointer group"
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
          {server.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 h-10">
          {server.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="line-clamp-1">
              {server.category
                ? server.category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
                : 'Uncategorized'}
            </Badge>
          </div>
          {server.tags && server.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 h-12 overflow-hidden">
              {server.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {server.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{server.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
        {server.githubUrl && (
          <div className="mt-auto pt-4 border-t relative z-10">
             <Button
              variant="link"
              className="p-0 h-auto text-sm text-muted-foreground hover:text-primary inline-flex items-center"
              onClick={(e) => {
                e.stopPropagation()
                window.open(server.githubUrl || '', '_blank', 'noopener,noreferrer')
              }}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
