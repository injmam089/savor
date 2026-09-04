'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { formatDate } from '@/lib/utils';

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<any[]>([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch('/api/admin/coupons');
        if (res.ok) setCoupons(await res.json());
      } catch (error) {
        console.error(error);
      }
    };
    fetchCoupons();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Coupon Management</h1>
        <Button className="rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Coupon
        </Button>
      </div>

      <div className="bg-card/50 premium-card rounded-2xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-4 font-medium text-muted-foreground">Code</th>
                <th className="p-4 font-medium text-muted-foreground">Type</th>
                <th className="p-4 font-medium text-muted-foreground">Value</th>
                <th className="p-4 font-medium text-muted-foreground">Usage</th>
                <th className="p-4 font-medium text-muted-foreground">Expires</th>
                <th className="p-4 font-medium text-muted-foreground">Active</th>
                <th className="p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id} className="border-b border-border bg-card">
                  <td className="p-4 font-bold tracking-wider">{coupon.code}</td>
                  <td className="p-4"><Badge variant="outline">{coupon.type}</Badge></td>
                  <td className="p-4">{coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `$${coupon.value}`}</td>
                  <td className="p-4">{coupon.usedCount} / {coupon.maxUses || '∞'}</td>
                  <td className="p-4">{coupon.expiresAt ? formatDate(coupon.expiresAt) : 'Never'}</td>
                  <td className="p-4"><Switch checked={coupon.isActive} disabled /></td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No coupons found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
