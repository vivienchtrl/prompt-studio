import { createClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';
import { cache } from 'react';

/**
 * A server-side utility to get the authenticated user.
 * Throws an error if the user is not authenticated.
 * Cached per request to avoid duplicate DB calls.
 */
export const getAuthenticatedUser = cache(async (): Promise<User> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Authentication required. Please sign in.');
  }

  return user;
});
