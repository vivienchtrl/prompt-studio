'use client';

import * as React from 'react';
import { Settings2 } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ModelConfig } from '../types/definitions';

interface SettingsSelectorProps {
  config: ModelConfig;
  onConfigChange: (config: Partial<ModelConfig>) => void;
  disabled?: boolean;
}

export function SettingsSelector({
  config,
  onConfigChange,
  disabled,
}: SettingsSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" disabled={disabled} title="Model Settings">
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Open settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Model Parameters</h4>
            <p className="text-sm text-muted-foreground">
              Configure parameters for the model run.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="temperature">Temperature</Label>
              <Input
                id="temperature"
                type="number"
                className="col-span-2 h-8"
                min={0}
                max={2}
                step={0.1}
                value={config.temperature}
                onChange={(e) =>
                  onConfigChange({ temperature: Number(e.target.value) })
                }
              />
            </div>
            <Slider
              id="temperature-slider"
              max={2}
              min={0}
              step={0.1}
              value={[config.temperature]}
              onValueChange={(value) =>
                onConfigChange({ temperature: value[0] })
              }
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            />
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="topP">Top P</Label>
              <Input
                id="topP"
                type="number"
                className="col-span-2 h-8"
                min={0}
                max={1}
                step={0.1}
                value={config.topP}
                onChange={(e) =>
                  onConfigChange({ topP: Number(e.target.value) })
                }
              />
            </div>
            <Slider
              id="topP-slider"
              max={1}
              min={0}
              step={0.1}
              value={[config.topP]}
              onValueChange={(value) =>
                onConfigChange({ topP: value[0] })
              }
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            />
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="topK">Top K</Label>
              <Input
                id="topK"
                type="number"
                className="col-span-2 h-8"
                min={0}
                value={config.topK ?? ''}
                placeholder="Optional"
                onChange={(e) =>
                  onConfigChange({ topK: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxTokens">Max Tokens</Label>
              <Input
                id="maxTokens"
                type="number"
                className="col-span-2 h-8"
                min={1}
                value={config.maxTokens ?? ''}
                placeholder="No Limit"
                onChange={(e) =>
                  onConfigChange({ maxTokens: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="seed">Seed</Label>
              <Input
                id="seed"
                type="number"
                className="col-span-2 h-8"
                value={config.seed ?? ''}
                placeholder="Optional"
                onChange={(e) =>
                  onConfigChange({ seed: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="presencePenalty">Presence Penalty</Label>
              <Input
                id="presencePenalty"
                type="number"
                className="col-span-2 h-8"
                min={-2}
                max={2}
                step={0.1}
                value={config.presencePenalty ?? 0}
                onChange={(e) =>
                  onConfigChange({ presencePenalty: Number(e.target.value) })
                }
              />
            </div>
            <Slider
              id="presencePenalty-slider"
              max={2}
              min={-2}
              step={0.1}
              value={[config.presencePenalty ?? 0]}
              onValueChange={(value) =>
                onConfigChange({ presencePenalty: value[0] })
              }
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            />
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="frequencyPenalty">Frequency Penalty</Label>
              <Input
                id="frequencyPenalty"
                type="number"
                className="col-span-2 h-8"
                min={-2}
                max={2}
                step={0.1}
                value={config.frequencyPenalty ?? 0}
                onChange={(e) =>
                  onConfigChange({ frequencyPenalty: Number(e.target.value) })
                }
              />
            </div>
            <Slider
              id="frequencyPenalty-slider"
              max={2}
              min={-2}
              step={0.1}
              value={[config.frequencyPenalty ?? 0]}
              onValueChange={(value) =>
                onConfigChange({ frequencyPenalty: value[0] })
              }
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

