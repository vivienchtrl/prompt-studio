// components/seo/HowToSchema.tsx
import React from 'react'
import { JsonLdSchema } from './JsonLdSchema'

interface HowToStep {
  name: string
  text: string
  url?: string
}

interface HowToSchemaProps {
  name: string
  description: string
  steps: HowToStep[]
  estimatedTime?: string
}

export const HowToSchema: React.FC<HowToSchemaProps> = ({
  name,
  description,
  steps,
  estimatedTime
}) => {
  const payload = {
    name,
    description,
    ...(estimatedTime && { totalTime: estimatedTime }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url })
    }))
  }

  return <JsonLdSchema type="HowTo" payload={payload} />
}