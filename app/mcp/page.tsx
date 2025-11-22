import { McpServerService } from '@/lib/backend/services/mcp-server.service'
import { PaginationControl } from '@/components/shared/PaginationControl'
import { McpServerList } from './components/mcp-server-list'

type McpLibraryPageProps = {
  searchParams: Promise<{
    category?: string
    search?: string
    page?: string
  }>
}

export default async function McpLibraryPage({ searchParams }: McpLibraryPageProps) {
  const { category, search, page } = await searchParams
  
  const currentPage = Number(page) || 1
  const limit = 12
  
  const service = new McpServerService()
  const { data: servers, total } = await service.findPaginated(currentPage, limit, category, search)
  
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">MCP Library</h1>
        <div className="text-muted-foreground">
          {total} servers found
        </div>
      </div>

      <McpServerList servers={servers} />

      {totalPages > 1 && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/mcp"
          searchParams={{ category, search }}
        />
      )}
    </div>
  )
}
