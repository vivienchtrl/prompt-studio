import React from 'react'
import { JsonLdSchema } from './JsonLdSchema'

interface SoftwareApplicationSchemaProps {
  name: string
  description: string
  applicationCategory?: string
  operatingSystem?: string
  url?: string
  image?: string
  author?: string
  datePublished?: string
  dateModified?: string
  offers?: {
    price: string
    priceCurrency: string
  }
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
}

export const SoftwareApplicationSchema: React.FC<SoftwareApplicationSchemaProps> = ({
  name,
  description,
  applicationCategory = 'DeveloperApplication',
  operatingSystem = 'Any',
  url,
  image,
  author,
  datePublished,
  dateModified,
  offers = { price: '0', priceCurrency: 'USD' },
  aggregateRating
}) => {
  const payload = {
    name,
    description,
    applicationCategory,
    operatingSystem,
    ...(url ? { url } : {}),
    ...(image ? { image } : {}),
    ...(author ? { author: { '@type': 'Person', name: author } } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    offers: {
      '@type': 'Offer',
      ...offers
    },
    ...(aggregateRating ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ...aggregateRating
      }
    } : {})
  }

  return <JsonLdSchema type="SoftwareApplication" payload={payload} />
}
