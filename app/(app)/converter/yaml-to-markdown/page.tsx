'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { yamlToJson } from '@/lib/utils/parsers';
import { jsonToPromptNodes, promptNodesToMarkdown } from '@/lib/utils/transform';

export default function YamlToMarkdownPage() {
  const transform = (input: string) => {
    const json = yamlToJson(input);
    const nodes = jsonToPromptNodes(json);
    return promptNodesToMarkdown(nodes);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="YAML to Markdown Converter"
          description="Convert YAML documents to Markdown format."
          inputLabel="YAML Input"
          outputLabel="Markdown Output"
          transformer={transform}
          placeholder={'Title: My Doc\nSections:\n  - Intro\n  - Body'}
          sourceFormat="yaml"
          targetFormat="markdown"
        />
      </main>
      <Footer />
    </div>
  );
}
