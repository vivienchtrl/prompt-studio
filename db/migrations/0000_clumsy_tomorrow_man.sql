DO $$ BEGIN
 CREATE TYPE "public"."provider" AS ENUM('openai', 'cohere', 'mistral', 'google', 'meta', 'xai', 'anthropic', 'deepseek');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."mcp_server_category" AS ENUM('uncategorized', 'development_tools', 'code_repository', 'ide_integration', 'productivity', 'task_management', 'workflow_automation', 'research', 'knowledge_base', 'search_engine', 'media', 'image_processing', 'video_processing', 'design', 'ui_ux_tools', 'workplace', 'team_collaboration', 'document_sharing', 'file_management', 'cloud_storage', 'community', 'social_platform', 'forum_integration', 'ai', 'machine_learning', 'llm_tools', 'cloud_service', 'deployment', 'infrastructure', 'communication', 'messaging', 'video_conferencing', 'database_management', 'data_storage', 'data_analytics', 'security', 'authentication', 'authorization', 'monitoring', 'utilities', 'general_purpose', 'api_integration');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"json" jsonb NOT NULL,
	"markdown" text NOT NULL,
	"slug" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "templates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"json" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider_id" "provider" NOT NULL,
	"encrypted_api_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mcp_servers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"github_url" text,
	"category" "mcp_server_category" DEFAULT 'uncategorized' NOT NULL,
	"tags" varchar(255)[],
	"about" text,
	"features" jsonb,
	"readme" text,
	"slug" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mcp_servers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prompts" ADD CONSTRAINT "prompts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_api_keys" ADD CONSTRAINT "user_api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "slug_unique" ON "templates" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "prompts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_id_provider_id_unique_idx" ON "user_api_keys" USING btree ("user_id","provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mcp_servers_name_idx" ON "mcp_servers" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mcp_servers_category_idx" ON "mcp_servers" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mcp_servers_tags_idx" ON "mcp_servers" USING btree ("tags");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mcp_servers_created_at_idx" ON "mcp_servers" USING btree ("created_at");