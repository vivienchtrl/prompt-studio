'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { xmlToJson } from '@/lib/utils/parsers';
import { jsonToPromptNodes, promptNodesToMarkdown } from '@/lib/utils/transform';

export default function XmlToMarkdownPage() {
  const transform = (input: string) => {
    const json = xmlToJson(input);
    const nodes = jsonToPromptNodes(json);
    return promptNodesToMarkdown(nodes);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="XML to Markdown Converter"
          description="Convert XML data to Markdown format."
          inputLabel="XML Input"
          outputLabel="Markdown Output"
          transformer={transform}
          placeholder={'<doc>\n  <Title>My Doc</Title>\n  <Sections>\n    <item>Intro</item>\n    <item>Body</item>\n  </Sections>\n</doc>'}
          sourceFormat="xml"
          targetFormat="markdown"
        />
      </main>
      <Footer />
    </div>
  );
}
