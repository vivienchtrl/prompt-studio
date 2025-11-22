// components/seo/OrganizationSchema.tsx
import React from 'react'
import { JsonLdSchema } from './JsonLdSchema'

interface OrganizationSchemaProps {
  name: string
  url: string
  logo: string
  contactPoint?: {
    telephone?: string
    contactType?: string
  }
  socialMedia?: {
    facebook?: string
    twitter?: string
    linkedin?: string
  }
}

export const OrganizationSchema: React.FC<OrganizationSchemaProps> = ({
  name,
  url,
  logo,
  contactPoint,
  socialMedia
}) => {
  const payload = {
    name,
    url,
    logo,
    ...(contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        ...contactPoint
      }
    }),
    ...(socialMedia && {
      sameAs: Object.values(socialMedia).filter(Boolean)
    })
  }

  return <JsonLdSchema type="Organization" payload={payload} />
}