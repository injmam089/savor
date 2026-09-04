'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { Star } from 'lucide-react';

export default function ReviewModeration() {
  const [reviews, setReviews] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/admin/reviews');
        if (res.ok) setReviews(await res.json());
      } catch (error) {
        console.error(error);
      }
    };
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast({ title: `Review ${status.toLowerCase()} successfully` });
        setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
      }
    } catch (error) {
      toast({ title: 'Failed to update review', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Review Moderation</h1>

      <div className="bg-card/50 premium-card rounded-2xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-4 font-medium text-muted-foreground">User</th>
                <th className="p-4 font-medium text-muted-foreground">Item</th>
                <th className="p-4 font-medium text-muted-foreground">Rating</th>
                <th className="p-4 font-medium text-muted-foreground">Comment</th>
                <th className="p-4 font-medium text-muted-foreground">Status</th>
                <th className="p-4 font-medium text-muted-foreground">Date</th>
                <th className="p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.id} className="border-b border-border bg-card">
                  <td className="p-4">{review.user?.name || 'Anonymous'}</td>
                  <td className="p-4">{review.menuItem?.name || 'Unknown'}</td>
                  <td className="p-4">
                    <div className="flex items-center text-amber-500">
                      <span>{review.rating}</span><Star className="w-4 h-4 ml-1 fill-current" />
                    </div>
                  </td>
                  <td className="p-4 max-w-xs truncate" title={review.comment}>{review.comment}</td>
                  <td className="p-4">
                    <Badge variant={review.status === 'APPROVED' ? 'default' : review.status === 'REJECTED' ? 'destructive' : 'secondary'}>
                      {review.status}
                    </Badge>
                  </td>
                  <td className="p-4">{formatDate(review.createdAt)}</td>
                  <td className="p-4">
                    {review.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdateStatus(review.id, 'APPROVED')} className="rounded-xl">Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(review.id, 'REJECTED')} className="rounded-xl">Reject</Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No reviews found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
