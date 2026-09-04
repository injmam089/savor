'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';

export default function ReservationManagement() {
  const [reservations, setReservations] = useState<any[]>([]);
  const { toast } = useToast();
  
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean, id: string, status: string}>({ isOpen: false, id: '', status: '' });

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/admin/reservations');
      if (res.ok) {
        setReservations(await res.json());
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/admin/reservations/${confirmDialog.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: confirmDialog.status })
      });
      if (res.ok) {
        toast({ title: 'Reservation updated' });
        setReservations(reservations.map(r => r.id === confirmDialog.id ? { ...r, status: confirmDialog.status } : r));
      }
    } catch (error) {
      toast({ title: 'Failed to update', variant: 'destructive' });
    } finally {
      setConfirmDialog({ isOpen: false, id: '', status: '' });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reservation Management</h1>

      <div className="bg-card/50 premium-card rounded-2xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-4 font-medium text-muted-foreground">ID</th>
                <th className="p-4 font-medium text-muted-foreground">Customer</th>
                <th className="p-4 font-medium text-muted-foreground">Date & Time</th>
                <th className="p-4 font-medium text-muted-foreground">Guests</th>
                <th className="p-4 font-medium text-muted-foreground">Status</th>
                <th className="p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res.id} className="border-b border-border bg-card">
                  <td className="p-4 font-mono text-sm">{res.id.slice(-6).toUpperCase()}</td>
                  <td className="p-4">{res.user?.name || res.guestName}</td>
                  <td className="p-4">{formatDateTime(res.date)}</td>
                  <td className="p-4">{res.guests}</td>
                  <td className="p-4">
                    <Badge variant={res.status === 'CONFIRMED' ? 'default' : res.status === 'CANCELLED' ? 'destructive' : 'secondary'}>
                      {res.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {res.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setConfirmDialog({ isOpen: true, id: res.id, status: 'CONFIRMED' })} className="rounded-xl">Confirm</Button>
                        <Button size="sm" variant="destructive" onClick={() => setConfirmDialog({ isOpen: true, id: res.id, status: 'CANCELLED' })} className="rounded-xl">Cancel</Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog 
        open={confirmDialog.isOpen} 
        onOpenChange={(open) => !open && setConfirmDialog({ ...confirmDialog, isOpen: false })} 
        onConfirm={handleUpdate} 
        title={`Mark as ${confirmDialog.status}`} 
        description={`Are you sure you want to mark this reservation as ${confirmDialog.status}?`} 
      />
    </div>
  );
}
