'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { jsonToPromptNodes, promptNodesToToon } from '@/lib/utils/transform';

export default function JsonToToonPage() {
  const transform = (input: string) => {
    const json = JSON.parse(input);
    const nodes = jsonToPromptNodes(json);
    return promptNodesToToon(nodes);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="JSON to TOON Converter"
          description="Convert JSON objects to Token-Oriented Object Notation (TOON)."
          inputLabel="JSON Input"
          outputLabel="TOON Output"
          transformer={transform}
          placeholder={'{\n  "title": "Example",\n  "tags": ["one", "two"]\n}'}
          sourceFormat="json"
          targetFormat="toon"
        />
      </main>
      <Footer />
    </div>
  );
}
