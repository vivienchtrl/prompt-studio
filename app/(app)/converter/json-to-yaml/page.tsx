'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { jsonToPromptNodes, promptNodesToYaml } from '@/lib/utils/transform';

export default function JsonToYamlPage() {
  const transform = (input: string) => {
    const json = JSON.parse(input);
    const nodes = jsonToPromptNodes(json);
    return promptNodesToYaml(nodes);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="JSON to YAML Converter"
          description="Convert JSON objects to YAML format."
          inputLabel="JSON Input"
          outputLabel="YAML Output"
          transformer={transform}
          placeholder={'{\n  "key": "value",\n  "list": ["a", "b"]\n}'}
          sourceFormat="json"
          targetFormat="yaml"
        />
      </main>
      <Footer />
    </div>
  );
}
