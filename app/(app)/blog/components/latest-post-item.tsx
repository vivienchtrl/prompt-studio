import Link from 'next/link'
import { format } from 'date-fns'
import { Post, User } from '@/lib/backend/types/payload.custom.types'

interface LatestPostItemProps {
  post: Post
}

export function LatestPostItem({ post }: LatestPostItemProps) {
  const author = post.author as User | undefined

  return (
    <div className="group relative py-4 first:pt-0">
      <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:underline">
        <Link href={`/blog/${post.slug}`}>
          {post.title}
        </Link>
      </h3>
      <div className="flex items-center text-sm text-muted-foreground gap-2">
        {author?.name && (
          <>
            <span>by {author.name}</span>
            <span>•</span>
          </>
        )}
        {post.publishedDate && (
          <time dateTime={post.publishedDate}>
            {format(new Date(post.publishedDate), 'MMMM d, yyyy')}
          </time>
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-border opacity-50" />
    </div>
  )
}

