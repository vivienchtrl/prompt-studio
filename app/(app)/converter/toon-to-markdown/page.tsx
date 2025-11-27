'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { toonToJson } from '@/lib/utils/toon-parser';
import { jsonToPromptNodes, promptNodesToMarkdown } from '@/lib/utils/transform';

export default function ToonToMarkdownPage() {
  const transform = (input: string) => {
    const json = toonToJson(input);
    const nodes = jsonToPromptNodes(json);
    return promptNodesToMarkdown(nodes);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="TOON to Markdown Converter"
          description="Convert Token-Oriented Object Notation (TOON) to Markdown."
          inputLabel="TOON Input"
          outputLabel="Markdown Output"
          transformer={transform}
          placeholder={'Doc:\n  Title: My Doc\n  Sections[2]: Intro,Body'}
          sourceFormat="toon"
          targetFormat="markdown"
        />
      </main>
      <Footer />
    </div>
  );
}
