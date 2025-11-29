'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Copy, Check, ArrowLeftRight, GitFork, HelpCircle, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

// SEO Imports
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { FAQSchema } from '@/components/seo/FAQSchema';
import { HowToSchema } from '@/components/seo/HowToSchema'; // Typo in filename kept as per user file

type Format = 'json' | 'xml' | 'yaml' | 'markdown' | 'toon';

interface ConverterInterfaceProps {
  title: string;
  description: string;
  inputLabel: string;
  outputLabel: string;
  transformer: (input: string) => Promise<string> | string;
  placeholder?: string;
  sourceFormat?: Format;
  targetFormat?: Format;
}

export function ConverterInterface({
  title,
  description,
  inputLabel,
  outputLabel,
  transformer,
  placeholder,
  sourceFormat,
  targetFormat
}: ConverterInterfaceProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await transformer(input);
      setOutput(result);
      toast.success('Converted successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Conversion failed. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const allFormats: Format[] = ['json', 'xml', 'yaml', 'markdown', 'toon'];

  // --- DYNAMIC CONTENT GENERATION ---

  const formatName = (f: string) => f.toUpperCase();
  
  // Default empty arrays if formats are missing (shouldn't happen on pages)
  let faqs: { question: string; answer: string }[] = [];
  let howToSteps: { name: string; text: string }[] = [];
  let breadcrumbs: { name: string; url: string }[] = [];

  if (sourceFormat && targetFormat) {
    const s = formatName(sourceFormat);
    const t = formatName(targetFormat);

    // Breadcrumbs
    breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Converters', url: '/converter' },
      { name: `${s} to ${t}`, url: `/converter/${sourceFormat}-to-${targetFormat}` }
    ];

    // FAQs
    faqs = [
      {
        question: `How do I convert ${s} to ${t}?`,
        answer: `Simply paste your ${s} code into the input box on the left, click the "Convert" button, and copy the resulting ${t} code from the output box.`
      },
      {
        question: `Is this ${s} to ${t} converter free?`,
        answer: "Yes, this tool is 100% free to use for personal and commercial purposes. There are no limits on usage."
      },
      {
        question: "Is my data safe?",
        answer: "Absolutely. The conversion happens entirely in your browser using JavaScript. Your data is never sent to our servers, ensuring complete privacy and security."
      },
      {
        question: `Can I convert ${t} back to ${s}?`,
        answer: `Yes! We have a dedicated tool for the reverse operation. Check the "Related Tools" section below to find the ${t} to ${s} converter.`
      }
    ];

    // How-To Steps
    howToSteps = [
      {
        name: "Step 1: Paste Input",
        text: `Copy your ${s} data from your clipboard and paste it into the "Input" text area.`
      },
      {
        name: "Step 2: Convert",
        text: "Click the blue 'Convert' button in the center of the screen to process your data."
      },
      {
        name: "Step 3: Copy Result",
        text: `Your converted ${t} data will appear in the right-hand box. Click the copy icon to save it to your clipboard.`
      }
    ];
  }

  return (
    <div className="container mx-auto py-10 max-w-5xl px-4">
        {/* --- SCHEMA MARKUP --- */}
        {sourceFormat && targetFormat && (
            <>
                <BreadcrumbSchema items={breadcrumbs} />
                <FAQSchema faqs={faqs} />
                <HowToSchema 
                    name={`How to convert ${formatName(sourceFormat)} to ${formatName(targetFormat)}`}
                    description={`A step-by-step guide to converting ${formatName(sourceFormat)} files to ${formatName(targetFormat)} format using our free online tool.`}
                    steps={howToSteps}
                    estimatedTime="PT1M"
                />
            </>
        )}

        {/* --- BREADCRUMBS VISUAL --- */}
        {sourceFormat && targetFormat && (
            <nav className="flex mb-8 text-sm text-muted-foreground">
                <ol className="flex items-center space-x-2">
                    <li><Link href="/" className="hover:text-primary">Home</Link></li>
                    <li>/</li>
                    <li><Link href="/converter" className="hover:text-primary">Converters</Link></li>
                    <li>/</li>
                    <li className="text-foreground font-medium">{formatName(sourceFormat)} to {formatName(targetFormat)}</li>
                </ol>
            </nav>
        )}

        <div className="flex flex-col space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{description}</p>
            </div>

            {/* --- CONVERTER UI --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="flex flex-col h-full border-2 focus-within:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="w-2 h-8 bg-primary rounded-full"/>
                            {inputLabel}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <Textarea
                            placeholder={placeholder}
                            className="min-h-[400px] font-mono text-sm resize-none focus-visible:ring-0 border-0 bg-muted/30 p-4"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </CardContent>
                </Card>

                <Card className="flex flex-col h-full relative border-2 bg-muted/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <div className="w-2 h-8 bg-secondary rounded-full"/>
                            {outputLabel}
                        </CardTitle>
                        <Button variant="outline" size="icon" onClick={handleCopy} disabled={!output}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <Textarea
                            readOnly
                            className="min-h-[400px] font-mono text-sm resize-none bg-muted border-0 focus-visible:ring-0 p-4 text-muted-foreground"
                            value={output}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center py-4">
                <Button onClick={handleConvert} disabled={loading || !input.trim()} size="lg" className="px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all">
                    {loading ? 'Converting...' : 'Convert Now'}
                    {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
            </div>

            {/* Related Tools Section */}
            {sourceFormat && targetFormat && (
                <div className="mt-8 space-y-6">
                    <div className="text-center border-t pt-12">
                        <h2 className="text-2xl font-semibold">Related Tools</h2>
                        <p className="text-muted-foreground mt-1">Other converters you might find useful</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Inverse Conversion */}
                        <Card className="hover:bg-muted/50 transition-colors group cursor-pointer">
                            <Link href={`/converter/${targetFormat}-to-${sourceFormat}`} className="flex items-center p-6">
                                <div className="p-3 bg-primary/10 rounded-full mr-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <ArrowLeftRight className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg uppercase">{targetFormat} to {sourceFormat}</h3>
                                    <p className="text-sm text-muted-foreground">Convert back to original format</p>
                                </div>
                            </Link>
                        </Card>

                        {/* Other Conversions from Source */}
                        <div className="space-y-3">
                            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide pl-1">
                                More {sourceFormat.toUpperCase()} Tools
                            </h3>
                            <div className="grid gap-3">
                                {allFormats
                                    .filter(f => f !== sourceFormat && f !== targetFormat)
                                    .slice(0, 3)
                                    .map(format => (
                                        <Link 
                                            key={format} 
                                            href={`/converter/${sourceFormat}-to-${format}`}
                                            className="p-4 bg-card border rounded-lg hover:bg-muted transition-colors flex items-center group"
                                        >
                                            <GitFork className="h-4 w-4 mr-3 text-muted-foreground group-hover:text-primary" />
                                            <span className="uppercase font-medium text-sm">{sourceFormat} to {format}</span>
                                            <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <div className="text-center pt-4">
                        <Button variant="link" asChild>
                            <Link href="/converter">View All Converters</Link>
                        </Button>
                    </div>
                </div>
            )}

            {/* --- SEO CONTENT SECTION --- */}
            {sourceFormat && targetFormat && (
                <div className="mt-16 grid gap-12">
                    
                    {/* How To Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold">How to use this converter</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {howToSteps.map((step, index) => (
                                <div key={index} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="text-4xl font-bold text-muted-foreground/20 mb-4">0{index + 1}</div>
                                    <h3 className="font-semibold text-lg mb-2">{step.name.replace(/Step \d+: /, '')}</h3>
                                    <p className="text-muted-foreground">{step.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="space-y-6">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <HelpCircle className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                        </div>
                        <Accordion type="single" collapsible className="w-full bg-card border rounded-xl px-6">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </section>
                </div>
            )}
        </div>
    </div>
  );
}
