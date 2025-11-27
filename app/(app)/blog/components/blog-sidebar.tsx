import { Post } from '@/lib/backend/types/payload.custom.types'
import { LatestPostItem } from './latest-post-item'

interface BlogSidebarProps {
  latestPosts: Post[]
}

export function BlogSidebar({ latestPosts }: BlogSidebarProps) {
  return (
    <aside className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-6">Latest</h2>
        <div className="flex flex-col space-y-2">
          {latestPosts.map((post) => (
            <LatestPostItem key={post.id} post={post} />
          ))}
        </div>
      </div>
    </aside>
  )
}

