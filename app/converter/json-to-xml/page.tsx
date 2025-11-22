'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { jsonToPromptNodes, promptNodesToXml } from '@/lib/utils/transform';

export default function JsonToXmlPage() {
  const transform = (input: string) => {
    const json = JSON.parse(input);
    const nodes = jsonToPromptNodes(json);
    return promptNodesToXml(nodes);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="JSON to XML Converter"
          description="Convert JSON data to XML format."
          inputLabel="JSON Input"
          outputLabel="XML Output"
          transformer={transform}
          placeholder={'{\n  "root": {\n    "item": "value"\n  }\n}'}
          sourceFormat="json"
          targetFormat="xml"
        />
      </main>
      <Footer />
    </div>
  );
}
