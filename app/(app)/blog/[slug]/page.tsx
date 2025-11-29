import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { Metadata } from 'next'
import { Navbar1 } from '@/components/navigation/nav-bar'
import { Footer } from '@/components/navigation/footer'

import { postService } from '@/lib/backend/services/post.service'
import { RichTextParser, extractHeadings } from '@/components/rich-text-parser'
import { TableOfContents } from './components/table-of-contents'
import { ShareButtons } from './components/share-buttons'
import { GoogleAdsense } from '@/components/google-adsense'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Category, User, Media } from '@/lib/backend/types/payload.custom.types'
import { ArticleSchema } from '@/components/seo/ArticleSchema'
import { FAQSchema } from '@/components/seo/FAQSchema'
import { HowToSchema } from '@/components/seo/HowToSchema'
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await postService.getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const coverImage = post.coverImage as Media | undefined
  
  return {
    title: post.title,
    description: `Read ${post.title} on our blog.`,
    openGraph: {
      title: post.title,
      description: `Read ${post.title} on our blog.`,
      type: 'article',
      publishedTime: post.publishedDate,
      authors: typeof post.author === 'object' && post.author?.name ? [post.author.name] : undefined,
      images: coverImage?.url ? [{ url: coverImage.url }] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await postService.getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const headings = extractHeadings(post.content)
  const pageUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://prompt-studio.com'}/blog/${post.slug}`
  
  const category = post.category as Category | undefined
  const author = post.author as User | undefined
  const coverImage = post.coverImage as Media | undefined
  const authorName = author?.name || 'Prompt Studio Team'
  const imageUrl = coverImage?.url || undefined

  const googleAdsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID || ''

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
    <div className="container mx-auto px-4 py-8 max-w-[1400px]">
      
      {/* Breadcrumbs */}
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
            </BreadcrumbItem>
            {category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/blog/category/${category.slug}`}>
                    {category.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 max-w-[300px]">
                {post.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 1. Standard Article Schema (Always present) */}
      <ArticleSchema
        title={post.title}
        description={`Read ${post.title} on Prompt Studio.`}
        publishedDate={post.publishedDate || new Date().toISOString()}
        modifiedDate={post.updatedAt}
        authorName={authorName}
        imageUrl={imageUrl}
        url={pageUrl}
      />

      {/* 2. Breadcrumb Schema (Always present) */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://prompt-studio.com' },
          { name: 'Blog', url: 'https://prompt-studio.com/blog' },
          ...(category ? [{ name: category.title, url: `https://prompt-studio.com/blog/category/${category.slug}` }] : []),
          { name: post.title, url: pageUrl },
        ]}
      />

      {/* 3. FAQ Schema (Conditional) */}
      {post.faqs && post.faqs.length > 0 && (
        <FAQSchema faqs={post.faqs} />
      )}

      {/* 4. HowTo Schema (Conditional) */}
      {post.enableHowTo && post.howToData && (
        <HowToSchema
          name={post.howToData.title}
          description={post.howToData.description || ''}
          estimatedTime={post.howToData.estimatedTime}
          steps={post.howToData.steps.map(step => ({
            name: step.title,
            text: step.text,
            url: step.url
          }))}
        />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[250px_1fr_300px] gap-8">
        
        {/* Header Section - Row 1, Col 2 */}
        <header className="xl:col-start-2 xl:row-start-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 border">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${author?.email || 'user'}`}
                  alt={author?.name || 'Author'}
                />
                <AvatarFallback>
                  {author?.name?.slice(0, 2).toUpperCase() || 'AU'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm">
                <span className="font-medium text-foreground">
                  {author?.name || 'Unknown Author'}
                </span>
                {post.publishedDate && (
                  <span>
                    on {format(new Date(post.publishedDate), 'MMMM d, yyyy')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Left Sidebar: Table of Contents - Row 2, Col 1 */}
        {/* Starts at the same level as the Main Content (Image) */}
        <aside className="hidden xl:block xl:col-start-1 xl:row-start-2">
          <div className="sticky top-24">
             <TableOfContents headings={headings} />
          </div>
        </aside>

        {/* Main Content - Row 2, Col 2 */}
        <article className="min-w-0 xl:col-start-2 xl:row-start-2">
          {/* Featured Image */}
          {coverImage?.url && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-10 bg-muted">
              <Image
                src={coverImage.url}
                alt={coverImage.alt || post.title}
                fill
                className="object-cover priority"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
              />
            </div>
          )}

          {/* Rich Text Content */}
          <RichTextParser content={post.content} />
          
          <Separator className="my-12" />
          
          {/* Mobile Share Buttons (visible only on mobile) */}
          <div className="xl:hidden mb-8">
             <ShareButtons url={pageUrl} title={post.title} />
          </div>
        </article>

        {/* Right Sidebar: Ads & Share Buttons - Row 1 & 2, Col 3 */}
        {/* Spans both rows to align Share Buttons with Title, but flow down to Ads */}
        <aside className="hidden xl:block xl:col-start-3 xl:row-start-1 xl:row-span-2 space-y-8">
          <div className="sticky top-24 space-y-8">
             {/* Share Buttons */}
             <div>
                 <ShareButtons url={pageUrl} title={post.title} />
             </div>
             
             {/* Ad Block */}
             <div className="w-full bg-muted/30 border rounded-lg p-4 min-h-[300px] flex flex-col items-center justify-center text-muted-foreground text-sm">
                 <span className="mb-2">Advertisement</span>
                 {/* Google AdSense Component */}
                 <GoogleAdsense pId={googleAdsenseId} />
                 {/* Placeholder for visual verification if ad doesn't load immediately */}
                 <div className="w-[250px] h-[250px] bg-muted/50 rounded border border-dashed flex items-center justify-center">
                     Ad Space
                 </div>
             </div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
    </div>
  )
}
