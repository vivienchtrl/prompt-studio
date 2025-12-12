'use client';

import * as React from 'react';
import { Plug2, Check, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { listUserMcpConnections } from '@/lib/backend/actions/mcp-connection.actions';
import type { McpConnection } from '@/lib/backend/types/mcp-connection';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface McpSelectorProps {
  selectedMcpIds: number[];
  onSelectionChange: (ids: number[]) => void;
  disabled?: boolean;
}

export function McpSelector({
  selectedMcpIds,
  onSelectionChange,
  disabled,
}: McpSelectorProps) {
  const [open, setOpen] = useState(false);
  const [connections, setConnections] = useState<McpConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch connections on mount or open
  useEffect(() => {
    const fetchConnections = async () => {
      setIsLoading(true);
      const result = await listUserMcpConnections();
      if (result.error) {
        toast.error('Failed to load MCP connections');
      } else if (result.data) {
        setConnections(result.data as McpConnection[]);
      }
      setIsLoading(false);
    };

    fetchConnections();
  }, []);

  const toggleSelection = (id: number) => {
    if (selectedMcpIds.includes(id)) {
      onSelectionChange(selectedMcpIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedMcpIds, id]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between min-w-[140px]"
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <Plug2 className="h-4 w-4 text-muted-foreground" />
            {selectedMcpIds.length > 0 ? (
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {selectedMcpIds.length} selected
              </Badge>
            ) : (
              <span className="text-muted-foreground">Add Tools</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Search MCP servers..." />
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm">
              <p className="text-muted-foreground mb-2">No MCP servers found.</p>
              <Button variant="link" className="h-auto p-0" asChild>
                <a href="/dashboard/mcp" target="_blank">Configure Connections</a>
              </Button>
            </CommandEmpty>
            <CommandGroup heading="Available Servers">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
              ) : (
                connections.map((conn) => (
                  <CommandItem
                    key={conn.id}
                    value={conn.name}
                    onSelect={() => toggleSelection(conn.id)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedMcpIds.includes(conn.id)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{conn.name}</span>
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
          {connections.length > 0 && (
             <div className="border-t p-2">
               <Button variant="ghost" size="sm" className="w-full justify-start h-8" asChild>
                  <a href="/dashboard/mcp" target="_blank" className="flex items-center text-xs text-muted-foreground">
                    <Plug2 className="mr-2 h-3 w-3" />
                    Manage Connections
                  </a>
               </Button>
             </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

