// components/seo/StudioPageSchema.tsx
import React from 'react'
import { JsonLdSchema } from '../JsonLdSchema'
import { BreadcrumbSchema } from '../BreadcrumbSchema'

export const StudioPageSchema: React.FC = () => {
  return (
    <>
      {/* WebPage Schema */}
      <JsonLdSchema 
        type="WebPage" 
        payload={{
          name: "Prompt Studio - AI structured prompt generator",
          description: "Create and transform AI structured prompts across multiple formats",
          mainEntity: {
            '@type': 'CreativeWork',
            name: 'AI Structured Prompt Generator',
            description: 'Advanced tool for crafting and transforming AI structured prompts across multiple formats (JSON, XML, Markdown, YAML, Toon, etc.)'
          }
        }} 
      />

      {/* Breadcrumb Schema */}
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "/" },
          { name: "Prompt Studio", url: "/studio" }
        ]} 
      />
    </>
  )
}