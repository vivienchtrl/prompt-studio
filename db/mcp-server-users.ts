import { pgEnum, pgTable, serial, varchar, uuid, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { authUsers } from './users';

export const mcpAuthTypeEnum = pgEnum('mcp_auth_type', [
  'none',
  'bearer',      // Token simple
  'basic',       // Username + Password
  'custom_header' // X-API-Key, etc.
]);

export const userMcpConnections = pgTable('user_mcp_connections', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => authUsers.id, {
    onDelete: 'cascade',
    onUpdate: 'no action',
  }),
  name: varchar('name').notNull(),
  
  // L'URL du endpoint SSE du serveur MCP distant
  url: varchar('url').notNull(), 
  
  authType: mcpAuthTypeEnum('auth_type').default('none').notNull(),
  
  // Stocke les secrets chiffrés (Token, ou JSON {username, password}, ou JSON {headerName, value})
  encryptedCredentials: varchar('encrypted_credentials'), 
  
  enabled: boolean('enabled').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  userIdIdx: index('user_mcp_connections_user_id_idx').on(table.userId),
  nameIdx: index('user_mcp_connections_name_idx').on(table.name),
  urlIdx: index('user_mcp_connections_url_idx').on(table.url),
  authTypeIdx: index('user_mcp_connections_auth_type_idx').on(table.authType),
  createdAtIdx: index('user_mcp_connections_created_at_idx').on(table.createdAt),
}));