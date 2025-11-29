import React from 'react'
import { JsonLdSchema } from './JsonLdSchema'

interface ArticleSchemaProps {
  title: string
  description?: string
  publishedDate: string
  modifiedDate?: string
  authorName: string
  imageUrl?: string
  url: string
}

export const ArticleSchema: React.FC<ArticleSchemaProps> = ({
  title,
  description,
  publishedDate,
  modifiedDate,
  authorName,
  imageUrl,
  url,
}) => {
  const payload = {
    headline: title,
    ...(description && { description }),
    ...(imageUrl && { image: [imageUrl] }),
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Prompt Studio', // Customize this
      logo: {
        '@type': 'ImageObject',
        url: 'https://prompt-studio.com/logo.png', // Customize this
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return <JsonLdSchema type="BlogPosting" payload={payload} />
}