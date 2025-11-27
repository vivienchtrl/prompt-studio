import { getPayload } from '@/lib/backend/utils/get-payload'
import { Post } from '@/lib/backend/types/payload.custom.types'
import type { Where } from 'payload'

export class PostRepository {
  async findAll({
    page = 1,
    limit = 10,
    categorySlug,
  }: {
    page?: number
    limit?: number
    categorySlug?: string
  } = {}): Promise<{ docs: Post[]; totalDocs: number; totalPages: number }> {
    const payload = await getPayload()
    
    // Ensure we only fetch published posts
    const where: Where = {
      _status: {
        equals: 'published',
      },
    }

    if (categorySlug) {
      // First we need to find the category ID
      const categoryResult = await payload.find({
        collection: 'categories',
        where: {
          slug: {
            equals: categorySlug,
          },
        },
      })

      if (categoryResult.docs.length > 0) {
        (where as Record<string, unknown>).category = {
          equals: categoryResult.docs[0].id,
        }
      } else {
        // Category not found, return empty
        return { docs: [], totalDocs: 0, totalPages: 0 }
      }
    }

    try {
      const result = await payload.find({
        collection: 'posts',
        where,
        sort: '-publishedDate',
        limit,
        page,
        depth: 2, // Populate authors, categories, media
      })

      return {
        docs: result.docs as unknown as Post[],
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      // Fallback if _status query fails (e.g. schema mismatch during dev)
      return { docs: [], totalDocs: 0, totalPages: 0 }
    }
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const payload = await getPayload()

    try {
      const result = await payload.find({
        collection: 'posts',
        where: {
          slug: {
            equals: slug,
          },
           _status: {
            equals: 'published',
          },
        },
        depth: 2,
        limit: 1,
      })

      if (result.docs.length === 0) {
        return null
      }

      return result.docs[0] as unknown as Post
    } catch (error) {
      console.error('Error fetching post by slug:', error)
      return null
    }
  }

  async findLatest(limit: number = 3): Promise<Post[]> {
    const payload = await getPayload()

    try {
      const result = await payload.find({
        collection: 'posts',
        where: {
          _status: {
            equals: 'published',
          },
        },
        sort: '-publishedDate',
        limit,
        depth: 2,
      })

      return result.docs as unknown as Post[]
    } catch (error) {
      console.error('Error fetching latest posts:', error)
      return []
    }
  }
}

export const postRepository = new PostRepository()
