import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

import { mcpConnectionService } from '@/lib/backend/services/mcp-connection.service';
import { AddMcpConnectionDialog } from './components/add-mcp-connection-dialog';
import { McpConnectionList } from './components/mcp-connection-list';
import { AuthGuard } from '@/components/auth/AuthGuard';

export const metadata: Metadata = {
  title: 'MCP Connections',
  description: 'Manage your Model Context Protocol server connections.',
};

export default async function McpConnectionsPage() {
  // Fix: createClient is async and must be awaited
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch connections only if user exists, otherwise empty array (AuthGuard will handle protection)
  const connections = user 
    ? await mcpConnectionService.getUserConnections(user.id) 
    : [];

  // Cast to the type expected by the client component
  const formattedConnections = connections.map(c => ({
    ...c,
    createdAt: c.createdAt ? new Date(c.createdAt) : null,
  }));

  return (
    <AuthGuard>
      <div className="flex flex-col gap-8 p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">MCP Connections</h1>
            <p className="text-muted-foreground">
              Connect your own Model Context Protocol servers to use their tools in the Prompt Lab.
            </p>
          </div>
          <AddMcpConnectionDialog />
        </div>

        <McpConnectionList connections={formattedConnections as any} />
      </div>
    </AuthGuard>
  );
}
