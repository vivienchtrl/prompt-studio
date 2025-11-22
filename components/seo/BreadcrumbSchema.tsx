// components/seo/BreadcrumbSchema.tsx
import React from 'react'
import { JsonLdSchema } from './JsonLdSchema'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items }) => {
  const payload = {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return <JsonLdSchema type="BreadcrumbList" payload={payload} />
}