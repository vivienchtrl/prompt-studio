'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { jsonToPromptNodes, promptNodesToMarkdown } from '@/lib/utils/transform';

export default function JsonToMarkdownPage() {
  const transform = (input: string) => {
    const json = JSON.parse(input);
    const nodes = jsonToPromptNodes(json);
    return promptNodesToMarkdown(nodes);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="JSON to Markdown Converter"
          description="Convert JSON objects to Markdown format."
          inputLabel="JSON Input"
          outputLabel="Markdown Output"
          transformer={transform}
          placeholder={'{\n  "Title": "My Doc",\n  "Sections": ["Intro", "Body"]\n}'}
          sourceFormat="json"
          targetFormat="markdown"
        />
      </main>
      <Footer />
    </div>
  );
}
