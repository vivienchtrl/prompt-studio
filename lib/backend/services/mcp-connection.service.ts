import { encrypt } from '@/lib/security/encryption';
import { mcpConnectionRepository } from '../repositories/mcp-connection.repository';
import type { CreateMcpConnectionInput } from '../types/mcp-connection';

export class McpConnectionService {
  async createConnection(userId: string, data: CreateMcpConnectionInput) {
    let encryptedCredentials: string | undefined;

    if (data.credentials && data.authType !== 'none') {
      encryptedCredentials = await encrypt(JSON.stringify(data.credentials));
    }

    return mcpConnectionRepository.create(userId, {
      ...data,
      encryptedCredentials,
    });
  }

  async getUserConnections(userId: string) {
    return mcpConnectionRepository.getByUserId(userId);
  }

  async deleteConnection(userId: string, connectionId: number) {
    return mcpConnectionRepository.delete(userId, connectionId);
  }
}

export const mcpConnectionService = new McpConnectionService();

