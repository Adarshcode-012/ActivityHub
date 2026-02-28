'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { login, ApiError } from '@/lib/api';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login({ email, password });
      authLogin(response.token, response.user);
      router.push('/');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="relative bg-card-bg border border-border-color p-10 shadow-sm">
          {/* Logo/Title */}
          <div className="text-center mb-10">
            <Link href="/">
              <h1 className="text-3xl font-serif text-[var(--gold-accent)] mb-4 cursor-pointer">
                ActivityHub
              </h1>
            </Link>
            <p className="text-foreground/50 text-sm">Sign in to your account</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 border border-red-500/20 bg-red-500/5">
              <p className="text-red-500/80 text-xs uppercase tracking-widest text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-foreground/70 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-0 py-3 bg-transparent border-b border-border-color text-foreground placeholder-foreground/20 focus:outline-none focus:border-[var(--gold-accent)] transition-colors"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-foreground/70 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-0 py-3 bg-transparent border-b border-border-color text-foreground placeholder-foreground/20 focus:outline-none focus:border-[var(--gold-accent)] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 py-4 bg-foreground text-background text-sm font-medium hover:bg-[var(--gold-accent)] hover:text-white transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-border-color"></div>
            <span className="px-4 text-foreground/40 text-[10px] uppercase tracking-widest">or</span>
            <div className="flex-1 border-t border-border-color"></div>
          </div>

          {/* Register link */}
          <p className="text-center text-foreground/60 text-sm">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-[var(--gold-accent)] hover:text-[var(--gold-accent-hover)] font-medium transition-colors border-b border-transparent hover:border-[var(--gold-accent-hover)] pb-1"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
