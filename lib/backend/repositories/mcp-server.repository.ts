// lib/backend/repositories/mcp-server.repository.ts
import { db } from '@/db'
import { mcpServerCategoryEnum, mcpServers } from '@/db/mcp-servers'
import { eq, sql, desc, ilike, or, and } from 'drizzle-orm'

export class McpServerRepository {
  async create(data: typeof mcpServers.$inferInsert): Promise<typeof mcpServers.$inferSelect> {
    const [createdServer] = await db
      .insert(mcpServers)
      .values(data)
      .returning()

    return createdServer
  }

  async findAll(): Promise<typeof mcpServers.$inferSelect[]> {
    return await db.select().from(mcpServers)
  }

  async findPaginated(
    page: number = 1, 
    limit: number = 12, 
    category?: string, 
    search?: string
  ): Promise<{ data: typeof mcpServers.$inferSelect[], total: number }> {
    const offset = (page - 1) * limit
    
    // Build where clause
    const whereConditions = []
    
    if (category && category !== 'all') {
      // @ts-expect-error - we know this is safe because of runtime check or we let drizzle handle enum validation error
      whereConditions.push(eq(mcpServers.category, category))
    }

    if (search) {
      const searchLower = `%${search.toLowerCase()}%`
      whereConditions.push(
        or(
          ilike(mcpServers.name, searchLower),
          ilike(mcpServers.description, searchLower)
        )
      )
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

    // Get data
    const data = await db
      .select()
      .from(mcpServers)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(mcpServers.createdAt)) // Newest first by default

    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(mcpServers)
      .where(whereClause)

    return {
      data,
      total: Number(countResult?.count || 0)
    }
  }

  async findById(id: number): Promise<typeof mcpServers.$inferSelect | undefined> {
    const [server] = await db
      .select()
      .from(mcpServers)
      .where(eq(mcpServers.id, id))
      .limit(1)
      .execute()

    return server
  }

  async findBySlug(slug: string): Promise<typeof mcpServers.$inferSelect | undefined> {
    const [server] = await db
      .select()
      .from(mcpServers)
      .where(eq(mcpServers.slug, slug))
      .limit(1)
      .execute()

    return server
  }

  async findRandom(limit: number = 3): Promise<typeof mcpServers.$inferSelect[]> {
    return await db
      .select()
      .from(mcpServers)
      .orderBy(sql`RANDOM()`)
      .limit(limit)
      .execute()
  }

  async update(
    id: number, 
    data: Partial<typeof mcpServers.$inferInsert>
  ): Promise<typeof mcpServers.$inferSelect | undefined> {
    const [updatedServer] = await db
      .update(mcpServers)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(mcpServers.id, id))
      .returning()

    return updatedServer
  }

  async delete(id: number): Promise<void> {
    await db
      .delete(mcpServers)
      .where(eq(mcpServers.id, id))
  }

  async findByCategory(category: typeof mcpServerCategoryEnum.enumValues[number]): Promise<typeof mcpServers.$inferSelect[]> {
    const servers = await db
      .select()
      .from(mcpServers)
      .where(eq(mcpServers.category, category))
      .execute()

    return servers
  }
}