// db/schema/mcp-servers.ts
import { pgTable, serial, text, timestamp, jsonb, varchar, index, pgEnum } from 'drizzle-orm/pg-core'

// Drizzle pgEnum for MCP Server Categories
export const mcpServerCategoryEnum = pgEnum('mcp_server_category', [
  // Fallback category to handle existing data
  'uncategorized',

  // Development and Tools
  'development_tools',
  'code_repository',
  'ide_integration',
  
  // Productivity and Workflow
  'productivity',
  'task_management',
  'workflow_automation',
  
  // Research and Knowledge
  'research',
  'knowledge_base',
  'search_engine',
  
  // Media and Creative
  'media',
  'image_processing',
  'video_processing',
  'design',
  'ui_ux_tools',
  
  // Workplace and Collaboration
  'workplace',
  'team_collaboration',
  'document_sharing',
  'file_management',
  'cloud_storage',
  
  // Community and Social
  'community',
  'social_platform',
  'forum_integration',
  
  // AI and Machine Learning
  'ai',
  'machine_learning',
  'llm_tools',
  
  // Cloud and Infrastructure
  'cloud_service',
  'deployment',
  'infrastructure',
  
  // Communication
  'communication',
  'messaging',
  'video_conferencing',
  
  // Database and Data Management
  'database_management',
  'data_storage',
  'data_analytics',
  
  // Security and Authentication
  'security',
  'authentication',
  'authorization',
  'monitoring',
  
  // Utilities and Miscellaneous
  'utilities',
  'general_purpose',
  'api_integration'
])

export const mcpServers = pgTable('mcp_servers', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    githubUrl: text('github_url'),
    category: mcpServerCategoryEnum('category').notNull().default('uncategorized'),
    tags: varchar('tags', { length: 255 }).array(),
    about: text('about'),
    features: jsonb('features').$type<string[]>(),
    readme: text('readme'),
    slug: text('slug').unique(),
    faq: jsonb('faq'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
  }, (table) => ({
    // Indexes remain the same
    nameIdx: index('mcp_servers_name_idx').on(table.name),
    categoryIdx: index('mcp_servers_category_idx').on(table.category),
    tagsIdx: index('mcp_servers_tags_idx').on(table.tags),
    createdAtIdx: index('mcp_servers_created_at_idx').on(table.createdAt)
  }))
