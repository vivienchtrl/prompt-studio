'use client';

import { useAuthContext } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, LogIn, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const AuthStatus = () => {
  const { user, isAuthenticated, loading, signOut } = useAuthContext();

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          {isAuthenticated ? (
            <User className="h-6 w-6 text-primary" />
          ) : (
            <LogIn className="h-6 w-6 text-primary" />
          )}
        </div>
        <CardTitle>
          {isAuthenticated ? 'Bienvenue !' : 'Connectez-vous'}
        </CardTitle>
        <CardDescription>
          {isAuthenticated
            ? `Connecté en tant que ${user?.email}`
            : 'Accédez aux fonctionnalités premium du studio'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAuthenticated ? (
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/studio" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Ouvrir le Studio
              </Link>
            </Button>
            <Button variant="outline" onClick={signOut} className="w-full">
              Se déconnecter
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/sign-up">Créer un compte</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
