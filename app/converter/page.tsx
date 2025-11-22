'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, FileJson, FileCode, FileType, FileText, Database } from 'lucide-react';
import { Navbar1 } from '@/components/navigation/nav-bar';
import { Footer } from '@/components/navigation/footer';

const tools = [
  {
    category: 'JSON Converters',
    icon: FileJson,
    items: [
      { href: '/converter/json-to-toon', label: 'JSON to TOON' },
      { href: '/converter/json-to-xml', label: 'JSON to XML' },
      { href: '/converter/json-to-yaml', label: 'JSON to YAML' },
      { href: '/converter/json-to-markdown', label: 'JSON to Markdown' },
    ]
  },
  {
    category: 'YAML Converters',
    icon: Database, // YAML often used for config/data
    items: [
      { href: '/converter/yaml-to-json', label: 'YAML to JSON' },
      { href: '/converter/yaml-to-xml', label: 'YAML to XML' },
      { href: '/converter/yaml-to-toon', label: 'YAML to TOON' },
      { href: '/converter/yaml-to-markdown', label: 'YAML to Markdown' },
    ]
  },
  {
    category: 'XML Converters',
    icon: FileCode,
    items: [
      { href: '/converter/xml-to-json', label: 'XML to JSON' },
      { href: '/converter/xml-to-yaml', label: 'XML to YAML' },
      { href: '/converter/xml-to-toon', label: 'XML to TOON' },
      { href: '/converter/xml-to-markdown', label: 'XML to Markdown' },
    ]
  },
  {
    category: 'TOON Converters',
    icon: FileType, // Custom format
    items: [
      { href: '/converter/toon-to-json', label: 'TOON to JSON' },
      { href: '/converter/toon-to-xml', label: 'TOON to XML' },
      { href: '/converter/toon-to-yaml', label: 'TOON to YAML' },
      { href: '/converter/toon-to-markdown', label: 'TOON to Markdown' },
    ]
  },
  {
    category: 'Markdown Converters',
    icon: FileText,
    items: [
      { href: '/converter/markdown-to-json', label: 'Markdown to JSON' },
      { href: '/converter/markdown-to-xml', label: 'Markdown to XML' },
      { href: '/converter/markdown-to-yaml', label: 'Markdown to YAML' },
      { href: '/converter/markdown-to-toon', label: 'Markdown to TOON' },
    ]
  },
];

export default function ConverterHubPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto py-16 max-w-6xl px-4">
        <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Developer Converters
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Free tools to convert between JSON, YAML, XML, Markdown, and TOON formats. 
          Simple, fast, and client-side.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((group) => (
          <Card key={group.category} className="flex flex-col overflow-hidden border-2 hover:border-primary/20 transition-colors">
            <CardHeader className="pb-4 bg-muted/30">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <group.icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl">{group.category}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 flex-1">
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className="group flex items-center justify-between p-2 -mx-2 rounded-md hover:bg-muted transition-colors text-sm font-medium"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      </main>
      <Footer />
    </div>
  );
}

