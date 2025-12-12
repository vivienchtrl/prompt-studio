CREATE TYPE "public"."mcp_auth_type" AS ENUM('none', 'bearer', 'basic', 'custom_header');--> statement-breakpoint
CREATE TABLE "user_mcp_connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar NOT NULL,
	"url" varchar NOT NULL,
	"auth_type" "mcp_auth_type" DEFAULT 'none' NOT NULL,
	"encrypted_credentials" varchar,
	"enabled" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_mcp_connections" ADD CONSTRAINT "user_mcp_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_mcp_connections_user_id_idx" ON "user_mcp_connections" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_mcp_connections_name_idx" ON "user_mcp_connections" USING btree ("name");--> statement-breakpoint
CREATE INDEX "user_mcp_connections_url_idx" ON "user_mcp_connections" USING btree ("url");--> statement-breakpoint
CREATE INDEX "user_mcp_connections_auth_type_idx" ON "user_mcp_connections" USING btree ("auth_type");--> statement-breakpoint
CREATE INDEX "user_mcp_connections_created_at_idx" ON "user_mcp_connections" USING btree ("created_at");