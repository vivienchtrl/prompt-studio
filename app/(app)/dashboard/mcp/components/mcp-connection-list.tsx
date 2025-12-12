'use client';

import { Trash2, Globe, Lock, ShieldCheck, Key } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { removeUserMcpConnection } from '@/lib/backend/actions/mcp-connection.actions';
import type { McpConnection } from '@/lib/backend/types/mcp-connection';

interface McpConnectionListProps {
  connections: McpConnection[];
}

export function McpConnectionList({ connections }: McpConnectionListProps) {
  const handleDelete = async (id: number) => {
    try {
      const result = await removeUserMcpConnection(id);
      if (result.error) {
        toast.error('Failed to remove connection');
        return;
      }
      toast.success('Connection removed');
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const getAuthIcon = (type: string) => {
    switch (type) {
      case 'bearer':
      case 'basic':
        return <Key className="h-3 w-3 mr-1" />;
      case 'custom_header':
        return <ShieldCheck className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  if (connections.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Globe className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No MCP servers connected</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
          Connect a Model Context Protocol server to give your AI agents access to external tools and data.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {connections.map((connection) => (
        <Card key={connection.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base font-medium">
                {connection.name}
              </CardTitle>
              <CardDescription className="text-xs truncate max-w-[200px]" title={connection.url}>
                {connection.url}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-1">
              <Badge variant="secondary" className="text-xs">
                {getAuthIcon(connection.authType)}
                {connection.authType === 'none' ? 'No Auth' : connection.authType}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between pt-4">
              <div className="text-xs text-muted-foreground">
                Added {connection.createdAt ? formatDistanceToNow(new Date(connection.createdAt), { addSuffix: true }) : 'Just now'}
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Connection?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove the connection to <strong>{connection.name}</strong>. 
                      Any prompts relying on this server's tools may fail.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleDelete(connection.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

