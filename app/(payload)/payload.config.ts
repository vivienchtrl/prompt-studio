import sharp from 'sharp'
import { lexicalEditor, BlocksFeature, FixedToolbarFeature, InlineToolbarFeature, HorizontalRuleFeature } from '@payloadcms/richtext-lexical'
import { EXPERIMENTAL_TableFeature } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { CallToAction } from './blocks/CallToAction'
import { Mermaid } from './blocks/Mermaid'
import { CodeBlock } from './blocks/CodeBlock'

// 1. Import the plugin and adapter
import { s3Storage } from '@payloadcms/storage-s3'

export default buildConfig({
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      EXPERIMENTAL_TableFeature(),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
      HorizontalRuleFeature(),
      BlocksFeature({
        blocks: [CallToAction, Mermaid, CodeBlock],
      }),
    ],
  }),
  collections: [Users, Posts, Media, Categories, Tags],
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      max: 4, // Change from 1 to 4
    },
    schemaName: 'payload',
  }),
  
  // 2. Add the plugins configuration
  plugins: [
    s3Storage({
      collections: {
        media: true, // Enable storage for the 'media' collection
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'us-east-1',
        endpoint: process.env.S3_ENDPOINT || '',
        forcePathStyle: true, // Required for Supabase S3
      },
    }),
  ],
  
  sharp,
})