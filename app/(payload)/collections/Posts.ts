import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  versions: {
    drafts: true,
  },
  access: {
    read: () => true, // Public read access (for your blog frontend)
    create: ({ req: { user } }) => {
      // Allow creation only if user is logged in
      return Boolean(user) 
    },
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
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
      required: true,
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
              required: true,
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
        }
      ]
    },
  ],
}