/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createBooking, ApiError } from '@/lib/api';

interface Activity {
  id: string;
  title: string;
  description: string | null;
  imageUrl?: string | null;
  date: string;
  capacity: number;
  availableSlots: number;
}

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const [isBooking, setIsBooking] = useState(false);
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvailabilityColor = () => {
    const percentage = (activity.availableSlots / activity.capacity) * 100;
    if (percentage > 50) return 'text-green-400';
    if (percentage > 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div
      className="group relative"
    >
      <div className="relative bg-card-bg border border-border-color overflow-hidden transition-all duration-700 hover:-translate-y-1">

        {/* Elegant Image Display */}
        <div className="w-full h-64 overflow-hidden relative border-b border-border-color bg-black/50">
          <img
            src={activity.imageUrl || 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=800&q=80'}
            alt={activity.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale-[30%] opacity-90"
          />
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col mb-4">
            <h3 className="text-2xl font-serif text-foreground transition-colors duration-500 group-hover:text-[var(--gold-accent)] mb-2">
              {activity.title}
            </h3>

            <div className={`text-xs font-semibold ${getAvailabilityColor()}`}>
              {activity.availableSlots} spots left
            </div>
          </div>

          {/* Description */}
          <p className="text-foreground/60 text-sm leading-loose mb-8 line-clamp-2">
            {activity.description || 'No description available'}
          </p>

          {/* Details */}
          <div className="space-y-4 mb-8 pt-6 border-t border-border-color">
            <div className="flex items-center gap-4 text-foreground/70">
              <span className="w-1.5 h-1.5 bg-[var(--gold-accent)] rounded-full hidden"></span>
              <span className="text-sm">{formatDate(activity.date)}</span>
            </div>

            <div className="flex items-center gap-4 text-foreground/70">
              <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full hidden"></span>
              <span className="text-sm">Capacity: {activity.capacity}</span>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={async () => {
              if (activity.availableSlots === 0) return;

              if (!isAuthenticated) {
                router.push('/signin');
                return;
              }

              setIsBooking(true);
              try {
                await createBooking({ activityId: activity.id }, token!);
                alert(`Successfully booked "${activity.title}"!\n\nCheck your bookings page to see all your activities.`);
                window.location.reload();
              } catch (err) {
                if (err instanceof ApiError) {
                  alert(`Booking failed: ${err.message}`);
                } else {
                  alert('Failed to create booking. Please try again.');
                }
              } finally {
                setIsBooking(false);
              }
            }}
            className={`w-full py-3 text-sm font-medium border transition-all duration-500 rounded-md ${activity.availableSlots > 0
              ? 'border-foreground text-foreground hover:bg-foreground hover:text-background'
              : 'border-border-color text-foreground/30 cursor-not-allowed'
              }`}
            disabled={activity.availableSlots === 0 || isBooking}
          >
            {isBooking ? 'Booking...' : activity.availableSlots > 0 ? 'Book Now' : 'Fully Booked'}
          </button>
        </div>
      </div>
    </div>
  );
}
