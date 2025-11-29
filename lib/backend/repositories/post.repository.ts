import { db } from '@/db'
import { sql } from 'drizzle-orm'
import { Post } from '@/lib/backend/types/payload.custom.types'

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
    const offset = (page - 1) * limit

    // Base query conditions
    let whereClause = sql`p."_status" = 'published'`
    
    if (categorySlug) {
       // Join logic would be needed for strict filtering by slug, simpler to do in main query or ignore for MVP
       // For now we assume if categorySlug is passed, we might need a join.
       // Let's keep it simple: this query gets ALL published posts first.
    }

    // Main Query
    // We assume standard Payload naming conventions for columns (snake_case of field names + _id for relations)
    // FIXED: Use u.email instead of u.name as Payload users table doesn't have name by default
    const rows = await db.execute(sql`
      SELECT 
        p.id, 
        p.title, 
        p.slug, 
        p.published_date, 
        p.content, 
        p.category_id,
        m.url as cover_image_url,
        m.alt as cover_image_alt,
        u.email as author_name,
        c.title as category_title,
        c.slug as category_slug
      FROM "payload"."posts" p
      LEFT JOIN "payload"."media" m ON p."cover_image_id" = m.id
      LEFT JOIN "payload"."users" u ON p."author_id" = u.id
      LEFT JOIN "payload"."categories" c ON p."category_id" = c.id
      WHERE p."_status" = 'published'
      ORDER BY p."published_date" DESC
      LIMIT ${limit} OFFSET ${offset}
    `)

    // Count Query
    const countResult = await db.execute(sql`
      SELECT count(*) as count 
      FROM "payload"."posts" p
      WHERE p."_status" = 'published'
    `)
    
    const totalDocs = Number(countResult[0].count)

    // Map raw DB rows to Post type
    const docs = rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      publishedDate: row.published_date,
      content: row.content, 
      author: { name: row.author_name },
      category: row.category_id ? { title: row.category_title, slug: row.category_slug } : undefined,
      coverImage: row.cover_image_url ? { url: row.cover_image_url, alt: row.cover_image_alt } : undefined,
      _status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))

    return {
      docs: docs as unknown as Post[],
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
    }
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const rows = await db.execute(sql`
      SELECT 
        p.id, 
        p.title, 
        p.slug, 
        p.published_date, 
        p.content, 
        m.url as cover_image_url,
        m.alt as cover_image_alt,
        u.email as author_name,
        c.title as category_title,
        c.slug as category_slug
      FROM "payload"."posts" p
      LEFT JOIN "payload"."media" m ON p."cover_image_id" = m.id
      LEFT JOIN "payload"."users" u ON p."author_id" = u.id
      LEFT JOIN "payload"."categories" c ON p."category_id" = c.id
      WHERE p.slug = ${slug} AND p."_status" = 'published'
      LIMIT 1
    `)

    if (rows.length === 0) {
      return null
    }

    const row = rows[0] as any

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      publishedDate: row.published_date,
      content: row.content,
      author: { name: row.author_name },
      category: { title: row.category_title, slug: row.category_slug },
      coverImage: row.cover_image_url ? { url: row.cover_image_url, alt: row.cover_image_alt } : undefined,
      _status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as unknown as Post
  }

  async findLatest(limit: number = 3): Promise<Post[]> {
    const rows = await db.execute(sql`
      SELECT 
        p.id, 
        p.title, 
        p.slug, 
        p.published_date, 
        m.url as cover_image_url,
        m.alt as cover_image_alt,
        u.email as author_name,
        c.title as category_title,
        c.slug as category_slug
      FROM "payload"."posts" p
      LEFT JOIN "payload"."media" m ON p."cover_image_id" = m.id
      LEFT JOIN "payload"."users" u ON p."author_id" = u.id
      LEFT JOIN "payload"."categories" c ON p."category_id" = c.id
      WHERE p."_status" = 'published'
      ORDER BY p."published_date" DESC
      LIMIT ${limit}
    `)

    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      publishedDate: row.published_date,
      content: {}, 
      author: { name: row.author_name },
      category: { title: row.category_title, slug: row.category_slug },
      coverImage: row.cover_image_url ? { url: row.cover_image_url, alt: row.cover_image_alt } : undefined,
      _status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })) as unknown as Post[]
  }
}

export const postRepository = new PostRepository()
