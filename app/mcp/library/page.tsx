import { McpServerService } from '@/lib/backend/services/mcp-server.service'
import { McpServerType } from '@/lib/backend/validators/mcp-server.schemas'
import { mcpServerCategoryEnum } from '@/db/mcp-servers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type McpLibraryPageProps = {
  searchParams: {
    category?: string
    search?: string
  }
}

export default async function McpLibraryPage({ searchParams }: McpLibraryPageProps) {
  const service = new McpServerService()
  const allServers = await service.findAll()

  const categories = mcpServerCategoryEnum.enumValues

  const filteredServers = allServers.filter((server) => {
    const matchesCategory = searchParams.category
      ? server.category === searchParams.category
      : true
    const matchesSearch = searchParams.search
      ? server.name.toLowerCase().includes(searchParams.search.toLowerCase()) ||
        server.description?.toLowerCase().includes(searchParams.search.toLowerCase())
      : true
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-4xl font-bold">MCP Library</h1>

      <div className="mb-6 flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="search">Search</Label>
          <Input id="search" type="text" placeholder="Search servers..." />
        </div>
        <div className="w-1/3">
          <Label htmlFor="category">Category</Label>
          <Select value={searchParams.category || ''}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServers.map((server) => (
          <McpServerCard key={server.id} server={server} />
        ))}
      </div>
    </div>
  )
}

const McpServerCard = ({ server }: { server: McpServerType }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{server.name}</CardTitle>
        <CardDescription>{server.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <span className="text-sm font-medium">Category: </span>
          <Badge variant="secondary">
            {server.category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </Badge>
        </div>
        {server.tags && server.tags.length > 0 && (
          <div className="mb-2">
            <span className="text-sm font-medium">Tags: </span>
            {server.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="mr-1">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {server.githubUrl && (
          <a
            href={server.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            GitHub
          </a>
        )}
      </CardContent>
    </Card>
  )
}
