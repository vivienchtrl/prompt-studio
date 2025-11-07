"use client";

import { AIInput } from "@/components/landingPage/ai-chat";
import { DottedSurface } from "@/components/landingPage/background";
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { useState } from 'react';

export default function DemoOne() {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?", 
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleSubmit = (value: string) => {
    // Vérifier l'authentification avant de rediriger
    if (!isAuthenticated) {
      setIsLoginDialogOpen(true);
      return;
    }
    
    // Si authentifié, encoder et rediriger vers le studio
    const encodedPrompt = encodeURIComponent(value);
    router.push(`/studio?prompt=${encodedPrompt}`);
  };

  return (
    <>
      <DottedSurface className="size-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
            'bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]',
            'blur-[30px]',
          )}
        />
        <div className="flex flex-col items-center relative z-10">
          <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
            Construisez des prompts qui performent
          </h2>
          <AIInput
            placeholder={placeholders[0]}
            onSubmit={handleSubmit}
          />
          
          {/* Dialog de connexion */}
          <LoginDialog 
            open={isLoginDialogOpen} 
            onOpenChange={setIsLoginDialogOpen} 
          />
        </div>
      </div>
    </>
  );
}
