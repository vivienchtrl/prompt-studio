'use client'
import { PromptOutput } from '@/lib/backend/types'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia, EmptyContent } from '@/components/ui/empty'
import { FileText } from 'lucide-react'
import { PromptCard } from './prompt-card'
import { CreatePromptButton } from './create-prompt-button'
import { createEmptyPrompt } from '@/lib/backend/actions/prompt.actions'  

interface PromptsListProps {
  prompts: PromptOutput[]
}

export function PromptsList({ prompts }: PromptsListProps) {
  if (prompts.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyMedia variant="icon">
          <FileText className="w-6 h-6" />
        </EmptyMedia>
        <EmptyContent>
          <EmptyHeader>
            <EmptyTitle>Aucun prompt créé</EmptyTitle>
            <EmptyDescription>Commencez par créer votre premier prompt pour démarrer!</EmptyDescription>
          </EmptyHeader>
          <form action={async () => { await createEmptyPrompt(); return undefined; }}>
            <CreatePromptButton />
          </form>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prompts.map((prompt) => (
        <PromptCard 
          key={prompt.id} 
          prompt={prompt} 
        />
      ))}
    </div>
  )
}

