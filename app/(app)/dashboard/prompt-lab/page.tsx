'use client';

import dynamic from 'next/dynamic';
import { PromptLabSkeleton } from './components/prompt-lab-skeleton';

// C'est ici que la magie opère : on charge le composant lourd uniquement quand nécessaire
const PromptLabClient = dynamic(
  () => import('./prompt-lab-client'),
  { 
    loading: () => <PromptLabSkeleton />,
    ssr: false // Désactive le rendu serveur pour ce composant lourd (optionnel mais souvent plus rapide pour les apps très interactives)
  }
);

export default function PromptLabPage() {
  return <PromptLabClient />;
}


