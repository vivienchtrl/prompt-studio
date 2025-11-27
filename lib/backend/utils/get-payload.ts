import { getPayload as getPayloadRaw } from 'payload'
import config from '@payload-config'
import type { Payload } from 'payload'

// Global cache to prevent multiple instances in development
declare global {
  var payload: Promise<Payload> | undefined
}

let cachedPayload = global.payload

if (!cachedPayload) {
  cachedPayload = getPayloadRaw({ config })
  if (process.env.NODE_ENV !== 'production') {
    global.payload = cachedPayload
  }
}

export const getPayload = async (): Promise<Payload> => {
  if (!cachedPayload) {
    // Should not happen given logic above, but satisfies TS
    return getPayloadRaw({ config })
  }
  return cachedPayload
}

