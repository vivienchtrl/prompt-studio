'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { markdownToJson } from '@/lib/utils/parsers';
import { jsonToPromptNodes, promptNodesToToon } from '@/lib/utils/transform';

export default function MarkdownToToonPage() {
  const transform = (input: string) => {
    const json = markdownToJson(input);
    const nodes = jsonToPromptNodes(json);
    return promptNodesToToon(nodes);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="Markdown to TOON Converter"
          description="Convert Markdown structure to Token-Oriented Object Notation (TOON)."
          inputLabel="Markdown Input"
          outputLabel="TOON Output"
          transformer={transform}
          placeholder={'## Title\nMy Doc\n\n## List\n- One\n- Two'}
          sourceFormat="markdown"
          targetFormat="toon"
        />
      </main>
      <Footer />
    </div>
  );
}
