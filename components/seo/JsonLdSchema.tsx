// components/seo/JsonLdSchema.tsx
import React from 'react'

type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

interface JsonLdSchemaProps {
  type: string
  payload: JsonObject
}

export const JsonLdSchema: React.FC<JsonLdSchemaProps> = ({ type, payload }) => {
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': type,
    ...payload
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(schemaMarkup, null, 2) 
      }}
    />
  )
}