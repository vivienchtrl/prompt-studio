// components/seo/library/LibraryPageSchema.tsx
import React from 'react'
import { JsonLdSchema } from '../JsonLdSchema'
import { BreadcrumbSchema } from '../BreadcrumbSchema'

export const LibraryPageSchema: React.FC = () => {
  return (
    <>
      {/* WebPage Schema */}
      <JsonLdSchema 
        type="WebPage" 
        payload={{
          name: "Prompt Library - AI structured prompt collection",
          description: "Explore a curated collection of AI structured prompts across various domains and various formats (JSON, XML, Markdown, YAML, Toon, etc.)",
          mainEntity: {
            '@type': 'CollectionPage',
            name: 'AI Structured Prompt Library',
            description: 'A comprehensive collection of AI structured prompts for various use cases and various formats (JSON, XML, Markdown, YAML, Toon, etc.)'
          }
        }} 
      />

      {/* Breadcrumb Schema */}
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "/" },
          { name: "Library", url: "/prompt-library" }
        ]} 
      />

      {/* Optional: CreativeWork Schema for the collection */}
      <JsonLdSchema 
        type="CreativeWork" 
        payload={{
          name: "AI Structured Prompt Collection",
          description: "A curated collection of AI structured prompts for developers, writers, and creators across various formats (JSON, XML, Markdown, YAML, Toon, etc.)",
          about: {
            '@type': 'Thing',
            name: 'AI Structured Prompts'
          }
        }} 
      />
    </>
  )
}