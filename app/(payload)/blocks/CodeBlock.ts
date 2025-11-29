import { Block } from 'payload'

export const CodeBlock: Block = {
  slug: 'Code', // Capitalized to match the existing frontend parser logic
  labels: {
    singular: 'Code Block',
    plural: 'Code Blocks',
  },
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      options: [
        { label: 'TypeScript', value: 'typescript' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'HTML', value: 'html' },
        { label: 'CSS', value: 'css' },
        { label: 'Python', value: 'python' },
        { label: 'Bash', value: 'bash' },
        { label: 'JSON', value: 'json' },
        { label: 'SQL', value: 'sql' },
        { label: 'React', value: 'jsx' },
        { label: 'Mermaid', value: 'mermaid' },
        { label: 'Plain Text', value: 'plaintext' },
      ],
      admin: {
        description: 'Select the language for syntax highlighting',
      },
    },
    {
      name: 'code',
      type: 'code',
      required: true,
      admin: {
        language: 'plaintext',
        editorOptions: {
           minimap: { enabled: false },
        }
      },
    },
  ],
}

