import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { z } from "zod";

// Structure pour passer les infos déchiffrées
export type McpConnectionConfig = {
  url: string;
  authType: 'none' | 'bearer' | 'basic' | 'custom_header';
  credentials?: any; // Déchiffré depuis la DB
};

// Interface étendue pour supporter les headers dans l'implémentation Node.js de EventSource
interface ExtendedEventSourceInit extends EventSourceInit {
  headers?: Record<string, string>;
}

export async function connectToUserMcpServer(config: McpConnectionConfig) {
  // 1. Préparer les headers d'auth
  const headers: Record<string, string> = {};
  let finalUrl = config.url;
  
  if (config.authType === 'bearer' && config.credentials?.token) {
    headers['Authorization'] = `Bearer ${config.credentials.token}`;

    // Spécial Supabase : Authentification via Query Param ET Header
    // C'est une stratégie "ceinture et bretelles" : si les headers sont perdus par le proxy SSE, l'URL prend le relais.
    // Cela ne nuit pas aux autres serveurs car on ne cible que ceux avec "supabase" dans l'URL.
    if (config.url.includes('supabase') || config.url.includes('supabase.co')) {
       console.log('[MCP] Supabase detected - Adding apikey to headers and URL');
       headers['apikey'] = config.credentials.token;
       
       const separator = finalUrl.includes('?') ? '&' : '?';
       finalUrl = `${finalUrl}${separator}apikey=${config.credentials.token}`;
    }
  } else if (config.authType === 'basic' && config.credentials?.username) {
    const encoded = Buffer.from(`${config.credentials.username}:${config.credentials.password}`).toString('base64');
    headers['Authorization'] = `Basic ${encoded}`;
  } else if (config.authType === 'custom_header' && config.credentials?.key) {
    headers[config.credentials.key] = config.credentials.value;
  }

  console.log(`[MCP] Connecting to ${finalUrl} (Headers: ${Object.keys(headers).join(', ')})`);

  // 2. Créer le transport SSE
  // On utilise l'interface étendue pour éviter 'any' tout en satisfaisant TypeScript
  const transport = new SSEClientTransport(new URL(finalUrl), {
    eventSourceInit: { headers } as ExtendedEventSourceInit
  });

  // 3. Initialiser le Client MCP
  const client = new Client(
    { name: "PromptStudio-Client", version: "1.0.0" },
    { capabilities: {} }
  );

  try {
    // 4. Connexion
    await client.connect(transport);

    // 5. Récupérer les outils disponibles
    const toolsList = await client.listTools();

    // 6. Transformer pour Vercel AI SDK
    const vercelTools: Record<string, any> = {};

    for (const tool of toolsList.tools) {
      vercelTools[tool.name] = {
        description: tool.description,
        parameters: z.any(), 
        
        execute: async (args: any) => {
          try {
            const result = await client.callTool({
              name: tool.name,
              arguments: args,
            });
            return result; 
          } catch (error) {
            console.error(`Error executing tool ${tool.name}:`, error);
            throw error;
          }
        },
      };
    }
  
    return { client, tools: vercelTools };
  } catch (error) {
    console.error(`Failed to connect to MCP server at ${finalUrl}`, error);
    return { client: null, tools: {} };
  }
}
