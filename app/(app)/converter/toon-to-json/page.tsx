'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { toonToJson } from '@/lib/utils/toon-parser';

export default function ToonToJsonPage() {
  const transform = (input: string) => {
    const json = toonToJson(input);
    return JSON.stringify(json, null, 2);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="TOON to JSON Converter"
          description="Convert Token-Oriented Object Notation (TOON) to JSON."
          inputLabel="TOON Input"
          outputLabel="JSON Output"
          transformer={transform}
          placeholder={'title: Example\ntags[2]: one,two\nmetadata:\n  created: 2024-01-01'}
          sourceFormat="toon"
          targetFormat="json"
        />
      </main>
      <Footer />
    </div>
  );
}
