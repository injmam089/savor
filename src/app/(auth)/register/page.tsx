'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { APP_NAME } from '@/lib/constants';

export default function RegisterPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      toast({ title: 'Success', description: 'Account created successfully' });
      await signIn('credentials', { redirect: false, email: formData.email, password: formData.password });
      router.push('/');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="premium-card p-10 w-full my-8 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
        <p className="text-muted-foreground mt-2 font-light">Create an account</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input name="name" placeholder="Full Name" onChange={handleChange} required className="bg-background/50 rounded-xl" />
        <Input name="email" type="email" placeholder="Email" onChange={handleChange} required className="bg-background/50 rounded-xl" />
        <Input name="phone" placeholder="Phone (Optional)" onChange={handleChange} className="bg-background/50 rounded-xl" />
        <Input name="password" type="password" placeholder="Password" onChange={handleChange} required className="bg-background/50 rounded-xl" />
        <Input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required className="bg-background/50 rounded-xl" />
        <Button type="submit" className="w-full rounded-full h-12 text-md mt-4 shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </form>
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link href="/login" className="text-primary hover:underline">Sign In</Link>
      </div>
    </div>
  );
}
