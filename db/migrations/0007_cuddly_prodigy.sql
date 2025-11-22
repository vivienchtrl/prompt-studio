CREATE TABLE IF NOT EXISTS "mcp_servers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"github_url" text,
	"category" text,
	"tags" varchar(255)[],
	"about" text,
	"features" jsonb,
	"readme" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
