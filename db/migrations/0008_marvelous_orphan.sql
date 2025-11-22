ALTER TABLE "mcp_servers" ALTER COLUMN "category" SET NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mcp_servers_name_idx" ON "mcp_servers" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mcp_servers_category_idx" ON "mcp_servers" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mcp_servers_tags_idx" ON "mcp_servers" USING btree ("tags");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mcp_servers_created_at_idx" ON "mcp_servers" USING btree ("created_at");