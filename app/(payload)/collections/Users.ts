import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true, // <--- AJOUTEZ CECI : Active la génération de clés API
  },
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    // Email and password are added by default when auth: true
  ],
}