'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PromptNode, NodeType } from '../types';
import { usePrompt } from '../hooks/usePrompt';
import { GripVertical, Plus, Trash2, X } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
 
type NodeEditorProps = {
  node: PromptNode;
  promptHook: ReturnType<typeof usePrompt>;
  onAddNode: (type: NodeType) => void;
};

const AddNodeMenu = ({
  trigger,
  onSelect,
}: {
  trigger: React.ReactNode;
  onSelect: (type: NodeType) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onSelect={() => onSelect('string')}>
        Add Text Field
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => onSelect('stringArray')}>
        Add Text List
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const NodeEditor = ({ node, promptHook, onAddNode }: NodeEditorProps) => {
  const { updateNode, removeNode, removeArrayItem, updateArrayItem } = promptHook;
  const sortable = useSortable({ id: node.id });
  const { attributes = {}, listeners = {}, setNodeRef, transform, transition, isDragging = false } = sortable || {};

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderNodeContent = () => {
    switch (node.type) {
      case 'string':
        return (
          <Input
            placeholder="Enter text value..."
            value={node.value}
            onChange={(e) => updateNode(node.id, { value: e.target.value })}
            className="flex-1"
          />
        );
      case 'stringArray':
        return (
          <div className="space-y-2">
            {node.values.map((value, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Item ${index + 1}...`}
                  value={value}
                  onChange={(e) => updateArrayItem(node.id, index, e.target.value)}
                  className="flex-1"
                />
                {node.values.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArrayItem(node.id, index)}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
            <AddNodeMenu 
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Item
                </Button>
              }
              onSelect={(type) => {
                if (type === 'string' || type === 'stringArray') {
                  onAddNode(type);
                }
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="space-y-3 p-4 border rounded-lg bg-background">
      <div className="flex items-center gap-2 group">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical size={18} className="text-muted-foreground" />
        </div>

        <Input
          placeholder="Field name..."
          value={node.key}
          onChange={(e) => updateNode(node.id, { key: e.target.value })}
          className="w-48 font-medium"
        />

        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
          {node.type === 'string' ? 'Text' : 'List'}
        </span>
        
        <div className="flex-1" />

        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeNode(node.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
      
      <div className="ml-6">{renderNodeContent()}</div>
    </div>
  );
};