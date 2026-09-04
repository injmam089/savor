'use client';
import { User, Settings, LogOut, Package, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 mt-24 max-w-6xl min-h-screen">
      <h1 className="text-4xl font-bold gradient-text mb-10">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="premium-card rounded-3xl border border-white/5 p-4 flex flex-col h-fit">
          <div className="p-4 border-b border-white/10 mb-2">
            <h3 className="font-semibold text-lg flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Profile</h3>
          </div>
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium transition-colors">
              <Settings className="w-4 h-4" /> Account Details
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-white/5 rounded-xl font-medium transition-colors">
              <Package className="w-4 h-4" /> My Orders
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-white/5 rounded-xl font-medium transition-colors">
              <Calendar className="w-4 h-4" /> Reservations
            </button>
          </nav>
          <div className="mt-8 pt-4 border-t border-white/10">
            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3">
          <div className="premium-card p-8 rounded-3xl border border-white/5">
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Full Name</label>
                  <p className="font-medium text-lg">John Doe</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Email Address</label>
                  <p className="font-medium text-lg">user@example.com</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Phone Number</label>
                  <p className="font-medium text-lg">Not provided</p>
                </div>
              </div>
              <div className="pt-6">
                <Button variant="outline" className="rounded-xl">Edit Profile</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
