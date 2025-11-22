// components/seo/FAQSchema.tsx
import React from 'react'
import { JsonLdSchema } from './JsonLdSchema'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs: FAQItem[]
}

export const FAQSchema: React.FC<FAQSchemaProps> = ({ faqs }) => {
  const payload = {
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return <JsonLdSchema type="FAQPage" payload={payload} />
}