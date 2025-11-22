'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { toonToJson } from '@/lib/utils/toon-parser';
import { jsonToPromptNodes, promptNodesToYaml } from '@/lib/utils/transform';

export default function ToonToYamlPage() {
  const transform = (input: string) => {
    const json = toonToJson(input);
    const nodes = jsonToPromptNodes(json);
    return promptNodesToYaml(nodes);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="TOON to YAML Converter"
          description="Convert Token-Oriented Object Notation (TOON) to YAML."
          inputLabel="TOON Input"
          outputLabel="YAML Output"
          transformer={transform}
          placeholder={'root:\n  title: Example\n  tags[2]: one,two'}
          sourceFormat="toon"
          targetFormat="yaml"
        />
      </main>
      <Footer />
    </div>
  );
}
