import { createClient } from '@/lib/supabase/server'
import {
  PromptOutput,
  CreatePromptInput,
  UpdatePromptInput,
  NotFoundError,
} from '@/lib/backend/types'
import { db } from '@/db'
import { prompts } from '@/db/prompts'

/**
 * Prompt Repository
 * Handles all prompt-related database operations
 */

export async function createPrompt(
  userId: string,
  data: CreatePromptInput
): Promise<PromptOutput> {
  const [newPrompt] = await db
    .insert(prompts)
    .values({
      userId: userId,
      title: data.title,
      content:
        typeof data.content === 'string'
          ? data.content
          : JSON.stringify(data.content),
      json: data.json,
    })
    .returning()

  if (!newPrompt) {
    throw new Error(`Failed to create prompt`)
  }

  return mapPromptResponse(newPrompt)
}

export async function getPromptById(id: string): Promise<PromptOutput> {
  const supabase = await createClient()

  const { data: prompt, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !prompt) {
    throw new NotFoundError('Prompt not found')
  }

  return mapPromptResponse(prompt)
}

export async function getPromptsByUserId(userId: string): Promise<PromptOutput[]> {
  const supabase = await createClient()

  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch prompts: ${error.message}`)
  }

  return prompts.map(mapPromptResponse)
}

export async function updatePrompt(
  id: string,
  data: UpdatePromptInput
): Promise<PromptOutput> {
  const supabase = await createClient()

  const updateData: Record<string, unknown> = {}
  if (data.title !== undefined) updateData.title = data.title
  if (data.content !== undefined) updateData.content = data.content
  if (data.json !== undefined) updateData.json = data.json

  const { data: prompt, error } = await supabase
    .from('prompts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error || !prompt) {
    throw new NotFoundError('Prompt not found')
  }

  return mapPromptResponse(prompt)
}

export async function deletePrompt(id: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from('prompts').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete prompt: ${error.message}`)
  }
}

/**
 * Response mapper - transform database object to output type
 */
function mapPromptResponse(
  prompt: Record<string, unknown> | null,
): PromptOutput {
  if (!prompt) {
    throw new Error('Invalid prompt data')
  }

  return {
    id: String(prompt.id),
    userId: String(prompt.user_id),
    title: String(prompt.title),
    content: String(prompt.content),
    json: (prompt.json as Record<string, unknown>) || {},
    createdAt: new Date(prompt.created_at as string),
    updatedAt: new Date(prompt.updated_at as string),
  }
}

