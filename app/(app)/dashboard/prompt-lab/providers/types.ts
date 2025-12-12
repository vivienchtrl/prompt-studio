import type { StreamTextResult } from 'ai';
import type { ModelConfig } from '../types/definitions';

export interface ProviderModel {
  id: string;
  name: string;
}

export interface ProviderRunParams {
  prompt: string;
  modelId: string;
  apiKey: string;
  config?: ModelConfig;
  tools?: Record<string, any>;
}

export type ProviderRunner = (
  params: ProviderRunParams,
) => Promise<StreamTextResult<Record<string, never>, string>>;

export interface ProviderImplementation {
  id: string;
  name: string;
  models: readonly ProviderModel[];
  runStream: ProviderRunner;
}

