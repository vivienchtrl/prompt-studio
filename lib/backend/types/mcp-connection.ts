import { z } from 'zod';

export type McpAuthType = 'none' | 'bearer' | 'basic' | 'custom_header';

export interface McpConnectionCredentials {
  token?: string;
  username?: string;
  password?: string;
  key?: string; // For custom header
  value?: string; // For custom header
}

export interface CreateMcpConnectionInput {
  name: string;
  url: string;
  authType: McpAuthType;
  credentials?: McpConnectionCredentials;
}

export interface McpConnection {
  id: number;
  userId: string;
  name: string;
  url: string;
  authType: McpAuthType;
  enabled: boolean;
  createdAt: Date | null;
  // We don't return encryptedCredentials to the client usually, or we return them redacted
}

