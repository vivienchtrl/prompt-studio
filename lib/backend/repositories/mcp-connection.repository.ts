import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/db';
import { userMcpConnections } from '@/db/mcp-server-users';
import type { CreateMcpConnectionInput, McpAuthType } from '../types/mcp-connection';

export class McpConnectionRepository {
  async create(userId: string, data: CreateMcpConnectionInput & { encryptedCredentials?: string }) {
    const [newConnection] = await db.insert(userMcpConnections).values({
      userId,
      name: data.name,
      url: data.url,
      authType: data.authType,
      encryptedCredentials: data.encryptedCredentials,
      enabled: true,
    }).returning();

    return newConnection;
  }

  async getByUserId(userId: string) {
    return db.select({
      id: userMcpConnections.id,
      userId: userMcpConnections.userId,
      name: userMcpConnections.name,
      url: userMcpConnections.url,
      authType: userMcpConnections.authType,
      enabled: userMcpConnections.enabled,
      createdAt: userMcpConnections.createdAt,
    })
    .from(userMcpConnections)
    .where(eq(userMcpConnections.userId, userId))
    .orderBy(desc(userMcpConnections.createdAt));
  }

  async delete(userId: string, connectionId: number) {
    await db.delete(userMcpConnections)
      .where(
        and(
          eq(userMcpConnections.id, connectionId),
          eq(userMcpConnections.userId, userId)
        )
      );
  }
}

export const mcpConnectionRepository = new McpConnectionRepository();

