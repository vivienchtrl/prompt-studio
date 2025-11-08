'use client';

import { ReactNode } from 'react';
import { useAuthContext } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Sparkles } from 'lucide-react';
import Link from 'next/link';

type AuthGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

const DefaultAuthWall = () => (
  <Card className="w-full max-w-md mx-auto">
    <CardHeader className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Sparkles className="h-6 w-6 text-primary" />
      </div>
      <CardTitle>Fonctionnalité Premium</CardTitle>
      <CardDescription>
        Vous devez être connecté pour utiliser la génération de prompts avec l&apos;IA
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground text-center">
          Accédez à toutes les fonctionnalités avancées :
        </p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Génération de prompts avec l&apos;IA</li>
          <li>• Frameworks de prompt avancés</li>
          <li>• Sauvegarde de vos prompts</li>
          <li>• Export dans tous les formats</li>
        </ul>
      </div>
      <div className="flex flex-col space-y-2">
        <Button asChild>
          <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" />
            Se connecter
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/sign-up">
            Créer un compte
          </Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || <DefaultAuthWall />;
  }

  return <>{children}</>;
};
