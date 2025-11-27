import { McpServerType } from '@/lib/backend/validators/mcp-server.schemas'
import { McpServerCard } from './mcp-server-card'

interface McpServerListProps {
  servers: McpServerType[]
}

export function McpServerList({ servers }: McpServerListProps) {
  if (servers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No servers found matching your criteria.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      {servers.map((server) => (
        <McpServerCard key={server.id} server={server} />
      ))}
    </div>
  )
}

