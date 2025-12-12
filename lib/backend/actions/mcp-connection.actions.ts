'use server';

import { createClient } from '@/lib/supabase/server';
import { mcpConnectionService } from '../services/mcp-connection.service';
import { createMcpConnectionSchema } from '../validators/mcp-connection.schemas';
import { revalidatePath } from 'next/cache';
import { connectToUserMcpServer, type McpConnectionConfig } from '@/app/(app)/dashboard/prompt-lab/utils/mcp-clients';

export async function addUserMcpConnection(data: unknown) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    const result = createMcpConnectionSchema.safeParse(data);
    if (!result.success) {
      return { error: result.error.flatten().fieldErrors };
    }

    // --- VALIDATION: TEST CONNECTION BEFORE SAVING ---
    console.log(`[MCP] Testing connection to ${result.data.url}...`);
    
    const testConfig: McpConnectionConfig = {
      url: result.data.url,
      authType: result.data.authType as any,
      credentials: result.data.credentials
    };

    // We attempt to connect. If it fails, connectToUserMcpServer returns { client: null }
    // Note: This might take a few seconds.
    const { client } = await connectToUserMcpServer(testConfig);
    
    if (!client) {
       // The connection failed (network error, 401, 404, etc.)
       // We return a generic error, but in a real app we might want to surface the exact error from the client utils
       return { error: 'Failed to connect to MCP server. Please check the URL and your credentials.' };
    }
    
    // Close the test connection immediately to clean up resources
    try {
      await client.close(); 
    } catch (e) { 
      console.warn('[MCP] Error closing test connection:', e);
    }

    // --- SUCCESS: SAVE TO DB ---
    await mcpConnectionService.createConnection(user.id, result.data);
    revalidatePath('/dashboard/mcp');
    return { success: true };
  } catch (error) {
    console.error('Failed to add MCP connection:', error);
    return { error: 'Failed to add MCP connection' };
  }
}

export async function listUserMcpConnections() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    const connections = await mcpConnectionService.getUserConnections(user.id);
    return { data: connections };
  } catch (error) {
    console.error('Failed to list MCP connections:', error);
    return { error: 'Failed to list MCP connections' };
  }
}

export async function removeUserMcpConnection(connectionId: number) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    await mcpConnectionService.deleteConnection(user.id, connectionId);
    revalidatePath('/dashboard/mcp');
    return { success: true };
  } catch (error) {
    console.error('Failed to remove MCP connection:', error);
    return { error: 'Failed to remove MCP connection' };
  }
}
