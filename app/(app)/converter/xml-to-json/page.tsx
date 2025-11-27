'use client';

import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';
import { ConverterInterface } from '@/components/free-tools/converter-interface';
import { xmlToJson } from '@/lib/utils/parsers';

export default function XmlToJsonPage() {
  const transform = (input: string) => {
    const json = xmlToJson(input);
    return JSON.stringify(json, null, 2);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ConverterInterface
          title="XML to JSON Converter"
          description="Convert XML data to JSON format."
          inputLabel="XML Input"
          outputLabel="JSON Output"
          transformer={transform}
          placeholder={'<root>\n  <item>value</item>\n</root>'}
          sourceFormat="xml"
          targetFormat="json"
        />
      </main>
      <Footer />
    </div>
  );
}
