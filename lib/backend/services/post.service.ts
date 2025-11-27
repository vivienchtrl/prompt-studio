import { postRepository } from '@/lib/backend/repositories/post.repository'
import { Post } from '@/lib/backend/types/payload.custom.types'

export class PostService {
  async getBlogPosts({
    page = 1,
    limit = 10,
    categorySlug,
  }: {
    page?: number
    limit?: number
    categorySlug?: string
  } = {}) {
    return postRepository.findAll({ page, limit, categorySlug })
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    return postRepository.findBySlug(slug)
  }

  async getLatestPosts(limit: number = 3): Promise<Post[]> {
    return postRepository.findLatest(limit)
  }
}

export const postService = new PostService()

