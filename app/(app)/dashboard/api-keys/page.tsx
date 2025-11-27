import React, { Suspense } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { ApiKeysList } from './components/api-keys-list'
import { ApiKeysSkeleton } from './components/api-keys-skeleton'

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      {/* Cette partie statique s'affiche immédiatement */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground">
          Configure your API keys for each LLM provider.
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your API keys are encrypted and stored securely. They are never exposed to the client.
        </AlertDescription>
      </Alert>

      {/* Le chargement des données est isolé ici avec un Skeleton */}
      <Suspense fallback={<ApiKeysSkeleton />}>
        <ApiKeysList />
      </Suspense>
    </div>
  )
}
