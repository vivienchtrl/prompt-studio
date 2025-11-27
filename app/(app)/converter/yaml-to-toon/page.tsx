'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { yamlToJson } from '@/lib/utils/parsers';
import { jsonToPromptNodes, promptNodesToToon } from '@/lib/utils/transform';

export default function YamlToToonPage() {
  const transform = (input: string) => {
    const json = yamlToJson(input);
    const nodes = jsonToPromptNodes(json);
    return promptNodesToToon(nodes);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="YAML to TOON Converter"
          description="Convert YAML documents to Token-Oriented Object Notation (TOON)."
          inputLabel="YAML Input"
          outputLabel="TOON Output"
          transformer={transform}
          placeholder={'title: Example\ntags:\n  - one\n  - two'}
          sourceFormat="yaml"
          targetFormat="toon"
        />
      </main>
      <Footer />
    </div>
  );
}
