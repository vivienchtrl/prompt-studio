// lib/backend/validators/mcp-server.schemas.ts
import { z } from 'zod'
import { mcpServerCategoryEnum } from '@/db/mcp-servers'

export const McpServerSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().nullable().optional(),
  githubUrl: z.string().url("L'URL GitHub doit être valide").nullable().optional(),
  category: z.enum(mcpServerCategoryEnum.enumValues).default('uncategorized'),
  tags: z.array(z.string()).nullable().optional(),
  about: z.string().nullable().optional(),
  features: z.array(z.string()).nullable().optional(),
  readme: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
  apiUrl: z.string().url("L'URL doit être valide").nullable().optional(),
  type: z.string().min(1, "Le type est requis").nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional()
})

export const CreateMcpServerSchema = McpServerSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
})

export const UpdateMcpServerSchema = McpServerSchema.partial()

export type McpServerType = z.infer<typeof McpServerSchema>
export type CreateMcpServerType = z.infer<typeof CreateMcpServerSchema>
export type UpdateMcpServerType = z.infer<typeof UpdateMcpServerSchema>