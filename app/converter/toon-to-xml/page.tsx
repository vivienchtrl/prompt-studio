'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { toonToJson } from '@/lib/utils/toon-parser';
import { jsonToPromptNodes, promptNodesToXml } from '@/lib/utils/transform';

export default function ToonToXmlPage() {
  const transform = (input: string) => {
    const json = toonToJson(input);
    const nodes = jsonToPromptNodes(json);
    return promptNodesToXml(nodes);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="TOON to XML Converter"
          description="Convert Token-Oriented Object Notation (TOON) to XML."
          inputLabel="TOON Input"
          outputLabel="XML Output"
          transformer={transform}
          placeholder={'root:\n  title: Example\n  tags[2]: one,two'}
          sourceFormat="toon"
          targetFormat="xml"
        />
      </main>
      <Footer />
    </div>
  );
}
