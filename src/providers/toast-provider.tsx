'use client';

import { Toaster } from '@/components/ui/toaster';
import { ToastProvider as ContextProvider } from '@/hooks/use-toast';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ContextProvider>
      {children}
      <Toaster />
    </ContextProvider>
  );
}
