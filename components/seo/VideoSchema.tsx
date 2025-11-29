import React from 'react'
import { JsonLdSchema } from './JsonLdSchema'

interface VideoSchemaProps {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  duration?: string
  contentUrl?: string
  embedUrl?: string
}

export const VideoSchema: React.FC<VideoSchemaProps> = ({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl,
  embedUrl,
}) => {
  const payload = {
    name,
    description,
    thumbnailUrl: [thumbnailUrl],
    uploadDate,
    ...(duration && { duration }),
    ...(contentUrl && { contentUrl }),
    ...(embedUrl && { embedUrl }),
  }

  return <JsonLdSchema type="VideoObject" payload={payload} />
}
