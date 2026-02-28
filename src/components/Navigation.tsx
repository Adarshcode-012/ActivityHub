'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-black/80 backdrop-blur-xl border-b border-white/10'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif text-[var(--gold-accent)] transition-opacity hover:opacity-80">
            ActivityHub
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#activities"
              className="text-sm uppercase tracking-widest text-foreground/70 hover:text-foreground transition-colors duration-300"
            >
              Activities
            </a>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-sm font-semibold text-[var(--gold-accent)] hover:text-foreground transition-colors duration-300"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/my-bookings"
                  className="text-sm uppercase tracking-widest text-foreground/70 hover:text-foreground transition-colors duration-300"
                >
                  My Bookings
                </Link>
                <div className="flex items-center gap-6">
                  <span className="text-foreground/70 text-sm tracking-wide">Hi, {user?.name}</span>
                  <button
                    onClick={logout}
                    className="px-6 py-2 border border-foreground/20 hover:border-foreground text-foreground text-xs uppercase tracking-widest transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => router.push('/signin')}
                className="px-8 py-3 bg-[var(--gold-accent)] hover:bg-[var(--gold-accent-hover)] text-white text-xs uppercase tracking-widest transition-colors duration-300"
              >
                Sign In
              </button>
            )}

            {/* Divider and Theme Toggle */}
            <div className="w-px h-6 bg-foreground/20" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
