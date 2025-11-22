'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { xmlToJson } from '@/lib/utils/parsers';
import { jsonToPromptNodes, promptNodesToYaml } from '@/lib/utils/transform';

export default function XmlToYamlPage() {
  const transform = (input: string) => {
    const json = xmlToJson(input);
    const nodes = jsonToPromptNodes(json);
    return promptNodesToYaml(nodes);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="XML to YAML Converter"
          description="Convert XML data to YAML format."
          inputLabel="XML Input"
          outputLabel="YAML Output"
          transformer={transform}
          placeholder={'<root>\n  <key>value</key>\n  <list>\n    <item>one</item>\n    <item>two</item>\n  </list>\n</root>'}
          sourceFormat="xml"
          targetFormat="yaml"
        />
      </main>
      <Footer />
    </div>
  );
}
