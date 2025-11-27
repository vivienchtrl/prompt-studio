import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { Post, Media, User, Category } from '@/lib/backend/types/payload.custom.types'

interface BlogCardProps {
  post: Post
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const coverImage = post.coverImage as Media | undefined
  const category = post.category as Category | undefined
  const author = post.author as User | undefined

  return (
    <Link href={`/blog/${post.slug}`} className="group h-full block">
      <Card className={`h-full overflow-hidden border-none shadow-none bg-transparent transition-colors ${featured ? '' : 'hover:bg-muted/50'}`}>
        {/* Image */}
        <div className={`relative overflow-hidden rounded-xl bg-muted ${featured ? 'aspect-[2/1]' : 'aspect-[16/9]'}`}>
          {coverImage?.url ? (
            <Image
              src={coverImage.url}
              alt={coverImage.alt || post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground">
              No Image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="pt-4 space-y-2">
          {category && (
            <Badge variant="secondary" className="rounded-md">
              {category.title}
            </Badge>
          )}
          
          <h3 className={`font-bold leading-tight tracking-tight ${featured ? 'text-3xl md:text-4xl' : 'text-xl'}`}>
            {post.title}
          </h3>

          {/* We might want to extract an excerpt from rich text content, but for now we skip it or add a description field later */}
          
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            {author?.name && (
              <>
                <span className="font-medium text-foreground">{author.name}</span>
                <span>•</span>
              </>
            )}
            {post.publishedDate && (
              <time dateTime={post.publishedDate}>
                {format(new Date(post.publishedDate), 'MMMM d, yyyy')}
              </time>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}

