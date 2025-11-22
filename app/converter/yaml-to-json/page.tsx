'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { yamlToJson } from '@/lib/utils/parsers';

export default function YamlToJsonPage() {
  const transform = (input: string) => {
    const json = yamlToJson(input);
    return JSON.stringify(json, null, 2);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="YAML to JSON Converter"
          description="Convert YAML documents to JSON format."
          inputLabel="YAML Input"
          outputLabel="JSON Output"
          transformer={transform}
          placeholder={'key: value\nlist:\n  - item1\n  - item2'}
          sourceFormat="yaml"
          targetFormat="json"
        />
      </main>
      <Footer />
    </div>
  );
}
