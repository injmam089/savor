'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Textarea } from '@/components/ui/textarea';

export default function MenuManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/menu');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleToggle = async (id: string, field: string, value: boolean) => {
    try {
      await fetch(`/api/admin/menu/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
      setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
      toast({ title: 'Updated successfully' });
    } catch {
      toast({ title: 'Failed to update', variant: 'destructive' });
    }
  };

  const handleSave = async () => {
    try {
      const isEdit = !!editingItem?.id;
      const url = isEdit ? `/api/admin/menu/${editingItem.id}` : '/api/admin/menu';
      const method = isEdit ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      
      if (res.ok) {
        toast({ title: `Item ${isEdit ? 'updated' : 'created'} successfully` });
        setIsDialogOpen(false);
        fetchItems();
      }
    } catch {
      toast({ title: 'Failed to save', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/admin/menu/${itemToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Item deleted' });
        setIsConfirmOpen(false);
        fetchItems();
      }
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  const filteredItems = items.filter(item => 
    (categoryFilter === 'all' || item.categoryId === categoryFilter) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
        <Button onClick={() => { setEditingItem({}); setIsDialogOpen(true); }} className="rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search menu..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px] rounded-xl">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card/50 premium-card rounded-2xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-4 font-medium text-muted-foreground">Image</th>
                <th className="p-4 font-medium text-muted-foreground">Name</th>
                <th className="p-4 font-medium text-muted-foreground">Category</th>
                <th className="p-4 font-medium text-muted-foreground">Price</th>
                <th className="p-4 font-medium text-center text-muted-foreground">Available</th>
                <th className="p-4 font-medium text-center text-muted-foreground">Featured</th>
                <th className="p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id} className="border-b border-border bg-card">
                  <td className="p-4">
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 bg-muted rounded" />}
                  </td>
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4"><Badge variant="outline">{item.category?.name || 'N/A'}</Badge></td>
                  <td className="p-4 font-medium">{formatPrice(item.price)}</td>
                  <td className="p-4 text-center">
                    <Switch checked={item.isAvailable} onCheckedChange={(v) => handleToggle(item.id, 'isAvailable', v)} />
                  </td>
                  <td className="p-4 text-center">
                    <Switch checked={item.isFeatured} onCheckedChange={(v) => handleToggle(item.id, 'isFeatured', v)} />
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setIsDialogOpen(true); }}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setItemToDelete(item.id); setIsConfirmOpen(true); }}><Trash className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-background border-border">
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input value={editingItem?.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input type="number" value={editingItem?.price || ''} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} className="rounded-xl" />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={editingItem?.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={editingItem?.categoryId || ''} onValueChange={(val) => setEditingItem({...editingItem, categoryId: val})}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input value={editingItem?.imageUrl || ''} onChange={e => setEditingItem({...editingItem, imageUrl: e.target.value})} className="rounded-xl" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={editingItem?.isVeg || false} onCheckedChange={v => setEditingItem({...editingItem, isVeg: v})} />
              <label className="text-sm font-medium">Vegetarian</label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={editingItem?.isAvailable ?? true} onCheckedChange={v => setEditingItem({...editingItem, isAvailable: v})} />
              <label className="text-sm font-medium">Available</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} className="rounded-xl">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog 
        open={isConfirmOpen} 
        onOpenChange={(open) => !open && setIsConfirmOpen(false)} 
        onConfirm={handleDelete} 
        title="Delete Item" 
        description="Are you sure you want to delete this menu item? This action cannot be undone." 
      />
    </div>
  );
}
