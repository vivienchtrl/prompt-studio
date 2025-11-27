import { PromptsList } from './components/PromptsList'
import { LibraryPageSchema } from '@/components/seo/studio/PromptLibrarySchema'
import { Navbar1 } from '@/components/navigation/nav-bar'
import { Footer } from '@/components/navigation/footer'


export default function PromptsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
      <LibraryPageSchema />
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Prompt Library</h1>
          <p className="mt-2 text-lg text-muted-foreground">Discover and explore our collection of prompts</p>
        </div>

        <PromptsList />
      </div>
      </main>
      <Footer />
    </div>
  )
}

