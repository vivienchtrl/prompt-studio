import { listPromptsAction } from '@/lib/backend/actions'
import { PromptOutput, isSuccessResponse } from '@/lib/backend'
import { PromptsList } from './prompts-list'

export async function PromptsListLoader() {
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
    <>
      <div className="mb-4 text-sm text-muted-foreground">
        You have {prompts?.length} prompt{prompts?.length !== 1 ? 's' : ''} saved.
      </div>
      <PromptsList prompts={prompts} />
    </>
  )
}
