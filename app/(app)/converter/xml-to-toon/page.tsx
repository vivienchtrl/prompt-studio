'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { xmlToJson } from '@/lib/utils/parsers';
import { jsonToPromptNodes, promptNodesToToon } from '@/lib/utils/transform';

export default function XmlToToonPage() {
  const transform = (input: string) => {
    const json = xmlToJson(input);
    const nodes = jsonToPromptNodes(json);
    return promptNodesToToon(nodes);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="XML to TOON Converter"
          description="Convert XML data to Token-Oriented Object Notation (TOON)."
          inputLabel="XML Input"
          outputLabel="TOON Output"
          transformer={transform}
          placeholder={'<root>\n  <title>Example</title>\n  <tags>\n    <item>one</item>\n    <item>two</item>\n  </tags>\n</root>'}
          sourceFormat="xml"
          targetFormat="toon"
        />
      </main>
      <Footer />
    </div>
  );
}
