import { Suspense } from 'react'
import { PromptsListLoader } from './components/prompts-list-loader'
import { PromptsSkeleton } from './components/prompts-skeleton'
import { CreatePromptButton } from './components/create-prompt-button'

export default function PromptsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Prompts</h1>
            <p className="text-gray-600 mt-2">
              Manage and organize your AI prompts.
            </p>
          </div>
          <CreatePromptButton />
        </div>

        <Suspense fallback={<PromptsSkeleton />}>
          <PromptsListLoader />
        </Suspense>
      </main>
    </div>
  )
}