import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  versions: {
    drafts: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: false, // Temporairement false pour récupérer les anciens articles
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenu',
          fields: [
            {
              name: 'content',
              type: 'richText',
            }
          ]
        },
        {
          label: 'SEO & Siloing', // Onglet dédié à la structure
          fields: [
            {
              name: 'category', // Le SILO principal
              type: 'relationship',
              relationTo: 'categories',
              required: false, // Temporairement false pour récupérer les anciens articles
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'tags', // Mots clés secondaires
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'isPillar', // Est-ce une page pilier ?
              type: 'checkbox',
              label: 'Est-ce une Page Pilier (Pillar Page) ?',
              defaultValue: false,
            },
            {
              name: 'parentPost', // Lien vers la page pilier (si ce n'en est pas une)
              type: 'relationship',
              relationTo: 'posts',
              label: 'Article Parent (Pilier)',
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_equals: id, // Ne peut pas être son propre parent
                  },
                  isPillar: {
                    equals: true // On ne peut choisir que des piliers comme parents
                  }
                };
              },
              admin: {
                condition: (data) => !data.isPillar, // Masquer si c'est déjà un pilier
              }
            }
          ]
        },
        {
          label: 'Schema.org',
          fields: [
            // 1. FAQ Schema
            {
              name: 'faqs',
              type: 'array',
              label: 'FAQ Schema',
              admin: {
                description: 'Add Questions & Answers for Google Rich Snippets.',
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
            // 2. HowTo Schema (Toggleable)
            {
              name: 'enableHowTo',
              type: 'checkbox',
              label: 'Enable How-To Schema',
              defaultValue: false,
            },
            {
              name: 'howToData',
              type: 'group',
              label: 'How-To Details',
              admin: {
                condition: (data) => Boolean(data.enableHowTo),
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title (e.g. "How to tie a tie")',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                },
                {
                  name: 'estimatedTime',
                  type: 'text',
                  label: 'Total Time (e.g. "PT30M" for 30 mins)',
                  admin: {
                    description: 'Use ISO 8601 format: PT1H (1 hour), PT30M (30 mins)',
                  },
                },
                {
                  name: 'steps',
                  type: 'array',
                  label: 'Steps',
                  required: true,
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      label: 'Step Title',
                      required: true,
                    },
                    {
                      name: 'text',
                      type: 'textarea',
                      label: 'Step Description',
                      required: true,
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: 'Link (Optional)',
                    },
                  ],
                },
              ],
            },
            // 3. Video Schema
            {
              name: 'enableVideo',
              type: 'checkbox',
              label: 'Enable Video Schema',
              defaultValue: false,
            },
            {
              name: 'videoData',
              type: 'group',
              label: 'Video Details',
              admin: {
                condition: (data) => Boolean(data.enableVideo),
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Video Title',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  label: 'Video Description',
                },
                {
                  name: 'thumbnailUrl',
                  type: 'text', // Or 'upload' if you want to host it
                  required: true,
                  label: 'Thumbnail URL',
                },
                {
                  name: 'uploadDate',
                  type: 'date',
                  required: true,
                  label: 'Upload Date',
                },
                {
                  name: 'duration',
                  type: 'text',
                  label: 'Duration (ISO 8601, e.g. PT2M30S)',
                },
                {
                  name: 'contentUrl',
                  type: 'text',
                  label: 'Content URL (.mp4 link)',
                },
                {
                  name: 'embedUrl',
                  type: 'text',
                  label: 'Embed URL (e.g. YouTube embed link)',
                },
              ],
            },
            // 4. Custom Schema (The "Catch-All" for anything else)
            {
              name: 'customSchema',
              type: 'json',
              label: 'Custom JSON-LD',
              admin: {
                description: 'Paste any valid JSON-LD here to add other schemas (e.g., Product, Review, SoftwareApplication).',
              },
            },
          ],
        },
      ]
    },
  ],
}