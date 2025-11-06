'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, LogOut, Package, Settings } from 'lucide-react';
import { signOut } from '@/lib/actions/auth';

interface UserMenuProps {
  user: {
    email: string;
    profile?: {
      full_name?: string;
    };
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await signOut();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:text-primary transition"
      >
        <User className="w-5 h-5" />
        <span className="hidden sm:inline">
          {user.profile?.full_name || user.email.split('@')[0]}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-20">
            <div className="px-4 py-2 border-b border-neutral-200">
              <p className="font-medium truncate">{user.profile?.full_name || 'User'}</p>
              <p className="text-sm text-neutral-600 truncate">{user.email}</p>
            </div>
            
            <Link
              href="/orders"
              className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-50 transition"
              onClick={() => setIsOpen(false)}
            >
              <Package className="w-4 h-4" />
              <span>My Orders</span>
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-50 transition"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>

            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-50 transition w-full text-left text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}