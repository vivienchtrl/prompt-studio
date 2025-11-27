import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { McpServerType } from '@/lib/backend/validators/mcp-server.schemas'

interface RelatedServersProps {
  servers: Partial<McpServerType>[]
  currentServerId?: number
}

export function RelatedServers({ servers, currentServerId }: RelatedServersProps) {
  const filteredServers = currentServerId 
    ? servers.filter(s => s.id !== currentServerId)
    : servers

  return (
    <div className="space-y-6">
      <div className="lg:sticky lg:top-6">
        <h2 className="text-xl font-semibold mb-4">Related Tools</h2>
        <div className="space-y-4">
          {filteredServers.map((related) => (
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
                      {related.category?.split('_')[0]}
                    </Badge>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
          {filteredServers.length === 0 && (
            <p className="text-muted-foreground text-sm">No related tools found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

