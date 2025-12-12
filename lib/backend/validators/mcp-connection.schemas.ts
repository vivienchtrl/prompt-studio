import { z } from 'zod';

export const createMcpConnectionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Invalid URL'),
  authType: z.enum(['none', 'bearer', 'basic', 'custom_header']),
  credentials: z.object({
    token: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    key: z.string().optional(),
    value: z.string().optional(),
  }).optional(),
}).refine((data) => {
  if (data.authType === 'bearer' && !data.credentials?.token) {
    return false;
  }
  if (data.authType === 'basic' && (!data.credentials?.username || !data.credentials?.password)) {
    return false;
  }
  if (data.authType === 'custom_header' && (!data.credentials?.key || !data.credentials?.value)) {
    return false;
  }
  return true;
}, {
  message: "Missing required credentials for selected authentication type",
  path: ["credentials"],
});

export type CreateMcpConnectionSchema = z.infer<typeof createMcpConnectionSchema>;

