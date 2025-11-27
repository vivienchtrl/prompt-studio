import { postService } from '@/lib/backend/services/post.service'
import { BlogCard } from './components/blog-card'
import { BlogSidebar } from './components/blog-sidebar'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | The Future of AI Innovation',
  description: 'Explore the latest insights and trends in AI technology.',
}

export default async function BlogPage() {
  // Fetch posts
  const { docs: posts } = await postService.getBlogPosts({ limit: 10 })

  if (!posts || posts.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    )
  }

  const featuredPost = posts[0]
  const latestPosts = posts.slice(1, 5) // Next 4 posts for the sidebar

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-6xl font-bold tracking-tighter">Blog</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Featured Post Area */}
        <div className="lg:col-span-8">
          <BlogCard post={featuredPost} featured />
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-4">
          <BlogSidebar latestPosts={latestPosts} />
        </div>
      </div>
    </main>
  )
}

