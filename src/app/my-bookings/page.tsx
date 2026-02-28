'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBookings } from '@/lib/api';

interface Booking {
  id: string;
  isCompleted: boolean;
  createdAt: string;
  activity: {
    id: string;
    title: string;
    description: string | null;
    date: string;
    capacity: number;
  };
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();

  const fetchBookings = useCallback(async () => {
    if (!token) return;

    try {
      const data = await getUserBookings(token);
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }

    fetchBookings();
  }, [isAuthenticated, router, fetchBookings]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatBookingDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  const upcomingBookings = bookings.filter(b => !b.isCompleted);
  const completedBookings = bookings.filter(b => b.isCompleted);

  const renderBookingCard = (booking: Booking, index: number, isCompleted: boolean) => (
    <div
      key={booking.id}
      className={`group relative bg-card-bg border ${isCompleted ? 'border-[var(--gold-accent)]/30 opacity-70' : 'border-border-color hover:border-[var(--gold-accent)]'} p-8 transition-all duration-500`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <h3 className={`text-2xl font-serif transition-colors ${isCompleted ? 'text-[var(--gold-accent)]' : 'text-foreground group-hover:text-[var(--gold-accent)]'}`}>
              {booking.activity.title}
            </h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${isCompleted ? 'bg-[var(--gold-accent)]/10 text-[var(--gold-accent)] border-[var(--gold-accent)]/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
              {isCompleted ? 'Completed' : 'Confirmed'}
            </span>
          </div>

          {booking.activity.description && (
            <p className="text-foreground/60 mb-6 line-clamp-2 text-sm leading-relaxed">
              {booking.activity.description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-6 text-sm text-foreground/70">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-[var(--gold-accent)] rounded-full hidden"></span>
              <span>{formatDate(booking.activity.date)}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full hidden"></span>
              <span>Booked on {formatBookingDate(booking.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border-color bg-card-bg">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-4 text-foreground/50 hover:text-[var(--gold-accent)] transition-colors mb-8 text-xs uppercase tracking-widest"
          >
            ← Back to Home
          </Link>

          <h1 className="text-4xl md:text-5xl font-serif text-foreground">
            My Bookings
          </h1>
          <p className="text-foreground/50 mt-4 text-sm">View and manage your activity bookings</p>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border border-[var(--gold-accent)] border-t-transparent animate-spin-slow rounded-full" />
          </div>
        )}

        {error && (
          <div className="border border-red-500/20 bg-red-500/5 p-6 text-center max-w-lg mx-auto">
            <p className="text-red-500/80 text-sm tracking-widest uppercase">{error}</p>
            <button
              onClick={fetchBookings}
              className="mt-4 px-6 py-2 border border-red-500/20 hover:border-red-500/40 text-red-500/80 text-xs tracking-widest uppercase transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-32 border-y border-border-color">
            <h3 className="text-2xl font-serif text-foreground mb-4">No Bookings Yet</h3>
            <p className="text-foreground/50 text-sm mb-10">Start exploring and book your first activity!</p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-[var(--gold-accent)] text-white font-medium hover:bg-[var(--gold-accent-hover)] transition-colors duration-300 rounded-md"
            >
              Browse Activities
            </Link>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-16">

            {/* Upcoming Section */}
            {upcomingBookings.length > 0 && (
              <div>
                <h2 className="text-2xl font-serif text-foreground mb-6 flex items-center gap-4">
                  Upcoming Activities
                  <span className="text-xs px-2 py-1 bg-foreground/10 text-foreground/70 rounded-full font-sans">
                    {upcomingBookings.length}
                  </span>
                </h2>
                <div className="grid gap-6">
                  {upcomingBookings.map((booking, index) => renderBookingCard(booking, index, false))}
                </div>
              </div>
            )}

            {/* Completed Section */}
            {completedBookings.length > 0 && (
              <div>
                <h2 className="text-2xl font-serif text-foreground mb-6 flex items-center gap-4">
                  Past & Completed
                  <span className="text-xs px-2 py-1 bg-foreground/10 text-foreground/70 rounded-full font-sans">
                    {completedBookings.length}
                  </span>
                </h2>
                <div className="grid gap-6">
                  {completedBookings.map((booking, index) => renderBookingCard(booking, index, true))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
