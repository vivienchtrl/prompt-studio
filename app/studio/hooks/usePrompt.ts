'use client';

import { useState, useCallback, useMemo } from 'react';
import { PromptNode, NodeType } from '../types';
import { promptNodesToJson } from '../utils/transform';

const createNewNode = (
  type: NodeType,
  key = ''
): PromptNode => ({
  id: crypto.randomUUID(),
  key,
  value: type === 'string' ? '' : '',
  values: type === 'stringArray' ? [''] : [],
  type,
});

const arrayMove = <T,>(array: T[], from: number, to: number): T[] => {
  const newArray = array.slice();
  const [removed] = newArray.splice(from, 1);
  newArray.splice(to, 0, removed);
  return newArray;
};

export const usePrompt = (initialNodes: PromptNode[] = []) => {
  const [nodes, setNodes] = useState<PromptNode[]>(initialNodes);

  const updateNode = useCallback(
    (id: string, updates: Partial<Omit<PromptNode, 'id'>>) => {
      setNodes((currentNodes) =>
        currentNodes.map((node) => {
          if (node.id === id) {
            const updatedNode = { ...node, ...updates };
            // Reset approprié selon le type
            if (updates.type && updates.type !== node.type) {
              if (updates.type === 'string') {
                updatedNode.value = '';
                updatedNode.values = [];
              } else if (updates.type === 'stringArray') {
                updatedNode.value = '';
                updatedNode.values = [''];
              }
            }
            return updatedNode;
          }
          return node;
        })
      );
    },
    []
  );

  const removeNode = useCallback((id: string) => {
    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== id));
  }, []);

  const addNode = useCallback((type: NodeType) => {
    const newNode = createNewNode(type);
    setNodes((currentNodes) => [...currentNodes, newNode]);
  }, []);

  const moveNode = useCallback((activeId: string, overId: string) => {
    if (activeId === overId) return;
    
    setNodes((currentNodes) => {
      const activeIndex = currentNodes.findIndex((n) => n.id === activeId);
      const overIndex = currentNodes.findIndex((n) => n.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        return arrayMove(currentNodes, activeIndex, overIndex);
      }
      return currentNodes;
    });
  }, []);

  // Gestion des array items
  const addArrayItem = useCallback((nodeId: string) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === nodeId && node.type === 'stringArray') {
          return {
            ...node,
            values: [...node.values, '']
          };
        }
        return node;
      })
    );
  }, []);

  const removeArrayItem = useCallback((nodeId: string, index: number) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === nodeId && node.type === 'stringArray') {
          return {
            ...node,
            values: node.values.filter((_, i) => i !== index)
          };
        }
        return node;
      })
    );
  }, []);

  const updateArrayItem = useCallback((nodeId: string, index: number, value: string) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === nodeId && node.type === 'stringArray') {
          const newValues = [...node.values];
          newValues[index] = value;
          return {
            ...node,
            values: newValues
          };
        }
        return node;
      })
    );
  }, []);

  const promptAsJson = useMemo(() => {
    const jsonObject = promptNodesToJson(nodes);
    return JSON.stringify(jsonObject, null, 2);
  }, [nodes]);

  const promptAsXml = useMemo(() => {
    // Grouper les nœuds par structure hiérarchique
    const xmlStructure: { [key: string]: any } = {};
    
    nodes.forEach(node => {
      if (node.key.includes('.')) {
        // Gérer les clés imbriquées comme "examples.positive"
        const parts = node.key.split('.');
        let current = xmlStructure;
        
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }
        
        const lastKey = parts[parts.length - 1];
        if (node.type === 'string') {
          current[lastKey] = node.value;
        } else if (node.type === 'stringArray') {
          current[lastKey] = node.values;
        }
      } else {
        // Clés simples
        if (node.type === 'string') {
          xmlStructure[node.key] = node.value;
        } else if (node.type === 'stringArray') {
          xmlStructure[node.key] = node.values;
        }
      }
    });

    // Convertir la structure en XML
    const convertToXml = (obj: any, indent = '  '): string => {
      return Object.entries(obj).map(([key, value]) => {
        if (Array.isArray(value)) {
          const items = value.map(item => `${indent}  <item>${item}</item>`).join('\n');
          return `${indent}<${key}>\n${items}\n${indent}</${key}>`;
        } else if (typeof value === 'object' && value !== null) {
          const nestedXml = convertToXml(value, indent + '  ');
          return `${indent}<${key}>\n${nestedXml}\n${indent}</${key}>`;
        } else {
          return `${indent}<${key}>${value}</${key}>`;
        }
      }).join('\n');
    };

    return `<root>\n${convertToXml(xmlStructure)}\n</root>`;
  }, [nodes]);

  const promptAsMarkdown = useMemo(() => {
    // Grouper les nœuds par structure hiérarchique pour le markdown
    const mdStructure: { [key: string]: any } = {};
    
    nodes.forEach(node => {
      if (node.key.includes('.')) {
        // Gérer les clés imbriquées comme "examples.positive"
        const parts = node.key.split('.');
        let current = mdStructure;
        
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }
        
        const lastKey = parts[parts.length - 1];
        if (node.type === 'string') {
          current[lastKey] = node.value;
        } else if (node.type === 'stringArray') {
          current[lastKey] = node.values;
        }
      } else {
        // Clés simples
        if (node.type === 'string') {
          mdStructure[node.key] = node.value;
        } else if (node.type === 'stringArray') {
          mdStructure[node.key] = node.values;
        }
      }
    });

    // Convertir la structure en Markdown
    const convertToMarkdown = (obj: any, level = 1): string => {
      return Object.entries(obj).map(([key, value]) => {
        const heading = '#'.repeat(Math.min(level, 6));
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        
        if (Array.isArray(value)) {
          const items = value.map(item => `- ${item}`).join('\n');
          return `${heading} ${capitalizedKey}\n\n${items}`;
        } else if (typeof value === 'object' && value !== null) {
          const nestedMd = convertToMarkdown(value, level + 1);
          return `${heading} ${capitalizedKey}\n\n${nestedMd}`;
        } else {
          return `${heading} ${capitalizedKey}\n\n${value}`;
        }
      }).join('\n\n');
    };

    return convertToMarkdown(mdStructure);
  }, [nodes]);

  return {
    nodes,
    setNodes,
    updateNode,
    removeNode,
    addNode,
    moveNode,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    promptAsJson,
    promptAsXml,
    promptAsMarkdown,
  };
};
