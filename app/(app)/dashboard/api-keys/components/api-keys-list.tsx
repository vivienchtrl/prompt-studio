import { fetchUserApiKeys } from '../actions/api-key-actions'
import { ApiKeysClient, ApiKeyState } from './api-keys-client'
import { PROVIDERS } from '@/app/(app)/dashboard/prompt-lab/types/definitions'
import { ApiKeyOutput } from '@/lib/backend/types/api-key'

export async function ApiKeysList() {
  // Ce composant est maintenant responsable du chargement des données
  const result = await fetchUserApiKeys()

  const initialApiKeys: Record<string, ApiKeyState> = {}
  
  // Prépare les données pour le client
  PROVIDERS.forEach((provider) => {
    const existingKey = (result.data as ApiKeyOutput[])?.find((k) => k.providerId === provider.id)
    initialApiKeys[provider.id] = {
      value: existingKey ? '••••••••••••••••' : '',
      isVisible: false,
      isSaving: false,
      isSaved: !!existingKey,
      savedApiKeyId: existingKey?.id,
    }
  })

  return <ApiKeysClient initialApiKeys={initialApiKeys} />
}
