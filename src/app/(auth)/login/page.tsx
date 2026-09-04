'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { APP_NAME } from '@/lib/constants';

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="premium-card p-8 w-full text-center">Loading...</div>}>
      <LoginForm />
    </React.Suspense>
  )
}

function LoginForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (res?.error) {
        toast({ title: 'Error', description: 'Invalid credentials', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Logged in successfully' });
        router.push(callbackUrl);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="premium-card p-10 w-full shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
        <p className="text-muted-foreground mt-2 font-light">Welcome back</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background/50 border-white/10 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-background/50 border-white/10 rounded-xl"
          />
        </div>
        <Button type="submit" className="w-full rounded-full h-12 text-md mt-4 shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account? <Link href="/register" className="text-primary hover:underline">Register</Link>
      </div>
    </div>
  );
}
