import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function MenuCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 rounded-xl border border-border/40 p-4">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="flex items-center justify-between pt-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="flex flex-col space-y-4 rounded-xl border border-border/40 p-6">
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-md border border-border/40 w-full">
      <div className="h-12 border-b border-border/40 px-4 flex items-center bg-muted/50">
        <Skeleton className="h-4 w-full" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 border-b border-border/40 px-4 flex items-center">
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}
