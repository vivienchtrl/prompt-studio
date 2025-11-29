import { Block } from 'payload'

export const CallToAction: Block = {
  slug: 'cta',
  labels: {
    singular: 'Call to Action',
    plural: 'Calls to Action',
  },
  fields: [
    {
      name: 'type', // 'simple' (button only) or 'banner' (card with text)
      type: 'select',
      defaultValue: 'banner',
      options: [
        { label: 'Simple Button', value: 'simple' },
        { label: 'Promo Banner', value: 'banner' },
      ],
      admin: {
        description: 'Choose "Simple Button" for a standalone button, or "Promo Banner" for a highlighted section with title and text.',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Banner Title',
      admin: {
        condition: (_, siblingData) => siblingData.type === 'banner',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Banner Description',
      admin: {
        condition: (_, siblingData) => siblingData.type === 'banner',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Button Label',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'Button URL',
        },
      ],
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      label: 'Visual Style',
      options: [
        { label: 'Default (Primary)', value: 'default' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
        { label: 'Ghost', value: 'ghost' },
      ],
    },
  ],
}
