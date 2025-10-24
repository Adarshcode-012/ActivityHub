'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
            ActivityHub
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#activities"
              className="text-white/70 hover:text-white transition-colors duration-300"
            >
              Activities
            </a>
            {isAuthenticated ? (
              <>
                <Link
                  href="/my-bookings"
                  className="text-white/70 hover:text-white transition-colors duration-300"
                >
                  My Bookings
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-white/70 text-sm">Hi, {user?.name}</span>
                  <button 
                    onClick={logout}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-medium transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <button 
                onClick={() => router.push('/signin')}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-medium hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-purple-500/50"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
