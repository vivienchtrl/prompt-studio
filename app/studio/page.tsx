'use client';

import { FrameworkSelector } from './components/FrameworkSelector';
import { PromptEditorForm } from './components/PromptEditorForm';
import { AIPromptGenerator } from './components/AIPromptGenerator';
import { usePrompt } from './hooks/usePrompt';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { CodeView } from './components/CodeView';
import { PromptNode } from './types';
import { jsonToPromptNodes } from './utils/transform';
import { useSearchParams } from 'next/navigation';
import { generatePromptWithAI } from './actions/ai-actions';
import { toast } from 'sonner';
import { useState, useEffect, useRef, useCallback, Suspense } from 'react';

function EditorPageContent() {
  const promptHook = usePrompt();
  const searchParams = useSearchParams();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Read the prompt query param
  const promptRequest = searchParams.get('prompt');
  
  // Ref pour éviter la double génération (React 18 Strict Mode)
  const hasGeneratedRef = useRef(false);

  const handleAIGenerated = useCallback(async (content: Record<string, unknown>) => {
    try {
      const jsonData = typeof content === 'string' ? JSON.parse(content) : content;
      const promptNodes = jsonToPromptNodes(jsonData);
      promptHook.setNodes(promptNodes);
    } catch (error) {
      console.error('Failed to parse AI generated content:', error);
      const fallbackNode: PromptNode = {
        id: crypto.randomUUID(),
        key: 'generated_prompt',
        value: typeof content === 'string' ? content : JSON.stringify(content),
        values: [],
        type: 'string',
      };
      promptHook.setNodes([fallbackNode]);
    }
  }, [promptHook.setNodes]);

  // Auto-generate prompt if query param exists
  useEffect(() => {
    const handleAutoGenerate = async () => {
      // Éviter la double génération
      if (!promptRequest || isGenerating || hasGeneratedRef.current) return;
      
      hasGeneratedRef.current = true;
      setIsGenerating(true);
      
      try {
        const result = await generatePromptWithAI(promptRequest);
        
        if (result.success && result.content) {
          await handleAIGenerated(JSON.parse(result.content as string));
          toast.success('Prompt généré avec succès! ✨');
          
          // Clean URL after generation
          window.history.replaceState({}, '', '/studio');
        } else {
          toast.error(result.error || 'Échec de la génération');
        }
      } catch (error) {
        console.error('Error generating prompt:', error);
        toast.error('Une erreur est survenue');
      } finally {
        setIsGenerating(false);
      }
    };

    handleAutoGenerate();
  }, [promptRequest, isGenerating, handleAIGenerated]); // Ne dépend que de promptRequest et isGenerating

  return (
    <div className="flex h-screen bg-background text-foreground mt-20 mx-auto max-w-7xl">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="p-4 h-full overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Prompt Editor</h2>
            
            {isGenerating && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Génération en cours...
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <AIPromptGenerator onGenerate={handleAIGenerated} />
              <FrameworkSelector onSelect={(nodes: PromptNode[]) => promptHook.setNodes(nodes)} />
            </div>
            <div className="mt-4">
              <PromptEditorForm promptHook={promptHook} />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <div className="h-full">
            <Tabs defaultValue="json" className="h-full flex flex-col">
              <div className="p-2">
                <TabsList>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                  <TabsTrigger value="xml">XML</TabsTrigger>
                  <TabsTrigger value="markdown">Markdown</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="json" className="flex-grow">
                <CodeView code={promptHook.promptAsJson} language="json" />
              </TabsContent>
              <TabsContent value="xml" className="flex-grow">
                <CodeView code={promptHook.promptAsXml} language="xml" />
              </TabsContent>
              <TabsContent value="markdown" className="flex-grow">
                <CodeView code={promptHook.promptAsMarkdown} language="markdown" />
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
          Loading studio...
        </div>
      }
    >
      <EditorPageContent />
    </Suspense>
  );
}
