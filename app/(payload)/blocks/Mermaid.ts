import { Block } from 'payload'

export const Mermaid: Block = {
  slug: 'mermaid',
  labels: {
    singular: 'Mermaid Diagram',
    plural: 'Mermaid Diagrams',
  },
  fields: [
    {
      name: 'code',
      type: 'code',
      required: true,
      label: 'Mermaid Code',
      admin: {
        language: 'mermaid', // Though 'mermaid' might not be a standard monaco language, 'text' or 'javascript' is safe fallback if not supported
        description: 'Enter your Mermaid.js diagram code here.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
  ],
}

