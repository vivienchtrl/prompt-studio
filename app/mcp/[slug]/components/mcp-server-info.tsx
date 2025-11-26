import { Badge } from '@/components/ui/badge'
import { McpServerType } from '@/lib/backend/validators/mcp-server.schemas'

interface McpServerInfoProps {
  server: Partial<McpServerType> & { 
    name: string;
    category: string; 
  }
}

export function McpServerInfo({ server }: McpServerInfoProps) {
  return (
    <div className="space-y-8 pt-2">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Category & Tags</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-sm py-1.5 px-4">
            {server.category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
          </Badge>
          {server.tags && server.tags.map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-sm py-1.5 px-4">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {server.about && (
        <div>
          <h3 className="text-xl font-semibold mb-4">About</h3>
          <p className="text-muted-foreground leading-relaxed text-lg">{server.about}</p>
        </div>
      )}

      {server.features && server.features.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Features</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {server.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start text-muted-foreground">
                <span className="mr-2 mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
