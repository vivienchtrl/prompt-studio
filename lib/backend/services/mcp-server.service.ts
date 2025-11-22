// lib/backend/services/mcp-server.service.ts
import { McpServerRepository } from '../repositories/mcp-server.repository'
import { 
  CreateMcpServerType, 
  UpdateMcpServerType,
  CreateMcpServerSchema,
  UpdateMcpServerSchema
} from '../validators/mcp-server.schemas'
import { mcpServerCategoryEnum } from '@/db/mcp-servers'

export class McpServerService {
  private repository: McpServerRepository

  constructor() {
    this.repository = new McpServerRepository()
  }

  async create(data: CreateMcpServerType) {
    // Validation des données d'entrée
    const validatedData = CreateMcpServerSchema.parse(data)
    return this.repository.create(validatedData)
  }

  async findAll() {
    return this.repository.findAll()
  }

  async findPaginated(page: number = 1, limit: number = 12, category?: string, search?: string) {
    return this.repository.findPaginated(page, limit, category, search)
  }

  async findById(id: number) {
    const server = await this.repository.findById(id)
    if (!server) {
      throw new Error('Serveur MCP non trouvé')
    }
    return server
  }

  async findBySlug(slug: string) {
    const server = await this.repository.findBySlug(slug)
    /*
    // Not throwing error here to let the controller handle 404
    if (!server) {
      throw new Error('Serveur MCP non trouvé')
    }
    */
    return server
  }

  async findRelated(limit: number = 3) {
    return this.repository.findRandom(limit)
  }

  async update(id: number, data: UpdateMcpServerType) {
    // Validation des données de mise à jour
    const validatedData = UpdateMcpServerSchema.parse(data)
    return this.repository.update(id, validatedData)
  }

  async delete(id: number) {
    // Vérification de l'existence avant suppression
    await this.findById(id)
    return this.repository.delete(id)
  }

  async findByCategory(category: typeof mcpServerCategoryEnum.enumValues[number]) {
    return this.repository.findByCategory(category)
  }
}