'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { markdownToJson } from '@/lib/utils/parsers';

export default function MarkdownToJsonPage() {
  const transform = (input: string) => {
    const json = markdownToJson(input);
    return JSON.stringify(json, null, 2);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="Markdown to JSON Converter"
          description="Convert Markdown structure to JSON format."
          inputLabel="Markdown Input"
          outputLabel="JSON Output"
          transformer={transform}
          placeholder={'## Title\nMy Doc\n\n## List\n- One\n- Two'}
          sourceFormat="markdown"
          targetFormat="json"
        />
      </main>
      <Footer />
    </div>
  );
}
