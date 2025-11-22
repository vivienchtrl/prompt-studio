'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { yamlToJson } from '@/lib/utils/parsers';
import { jsonToPromptNodes, promptNodesToXml } from '@/lib/utils/transform';

export default function YamlToXmlPage() {
  const transform = (input: string) => {
    const json = yamlToJson(input);
    const nodes = jsonToPromptNodes(json);
    return promptNodesToXml(nodes);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="YAML to XML Converter"
          description="Convert YAML documents to XML format."
          inputLabel="YAML Input"
          outputLabel="XML Output"
          transformer={transform}
          placeholder={'root:\n  key: value\n  list:\n    - item1'}
          sourceFormat="yaml"
          targetFormat="xml"
        />
      </main>
      <Footer />
    </div>
  );
}
