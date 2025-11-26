import { Separator } from '@/components/ui/separator'
import { MarkdownProcessor } from './MarkdownProcessor'

interface McpReadmeProps {
  readme: string | null | undefined
}

export function McpReadme({ readme }: McpReadmeProps) {
  if (!readme) return null

  return (
    <div className="mt-8">
      <Separator className="my-8" />
      <h2 className="text-2xl font-semibold mb-6">Documentation</h2>
      <div className="prose dark:prose-invert max-w-none">
        <MarkdownProcessor content={readme} />
      </div>
    </div>
  )
}

