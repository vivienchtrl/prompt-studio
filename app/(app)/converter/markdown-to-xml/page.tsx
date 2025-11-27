'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { markdownToJson } from '@/lib/utils/parsers';
import { jsonToPromptNodes, promptNodesToXml } from '@/lib/utils/transform';

export default function MarkdownToXmlPage() {
  const transform = (input: string) => {
    const json = markdownToJson(input);
    const nodes = jsonToPromptNodes(json);
    return promptNodesToXml(nodes);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="Markdown to XML Converter"
          description="Convert Markdown structure to XML format."
          inputLabel="Markdown Input"
          outputLabel="XML Output"
          transformer={transform}
          placeholder={'## Title\nMy Doc\n\n## List\n- One\n- Two'}
          sourceFormat="markdown"
          targetFormat="xml"
        />
      </main>
      <Footer />
    </div>
  );
}
