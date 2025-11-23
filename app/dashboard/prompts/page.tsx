import { listPromptsAction } from '@/lib/backend/actions'
import { PromptOutput, isSuccessResponse } from '@/lib/backend'
import { PromptsList } from './components/prompts-list'
import { CreatePromptButton } from './components/create-prompt-button'
import { Navbar1 } from '@/components/navigation/nav-bar'
import { Footer } from '@/components/navigation/footer'

export default async function PromptsPage() {
  const response = await listPromptsAction()

  if (!isSuccessResponse(response)) {
    return (
      <div className="text-red-500">
        Erreur: {response.error?.message}
      </div>
    )
  }

  const prompts = response.data as PromptOutput[]

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1 />
      <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Prompts</h1>
          <p className="text-gray-600 mt-2">
            You have {prompts?.length} prompt{prompts?.length !== 1 ? 's' : ''} saved.
          </p>
        </div>
        <CreatePromptButton />
      </div>

      <PromptsList prompts={prompts} />
      </main>
      <Footer />
    </div>
  )
}