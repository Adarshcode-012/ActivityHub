'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createBooking, ApiError } from '@/lib/api';

interface Activity {
  id: number;
  title: string;
  description: string | null;
  date: string;
  capacity: number;
  availableSlots: number;
}

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const [isHovered, setIsHovered] = useState(false);
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-500`} />
      
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:-translate-y-2">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1))] bg-[length:20px_20px]" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
              {activity.title}
            </h3>
            
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getAvailabilityColor()} bg-white/10 backdrop-blur-sm`}>
              {activity.availableSlots} spots left
            </div>
          </div>

          {/* Description */}
          <p className="text-white/60 mb-6 line-clamp-2 group-hover:text-white/80 transition-colors duration-300">
            {activity.description || 'No description available'}
          </p>

          {/* Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-white/70">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{formatDate(activity.date)}</span>
            </div>
            
            <div className="flex items-center gap-3 text-white/70">
              <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
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
                // Refresh the page to update available slots
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
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
              activity.availableSlots > 0
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 disabled:opacity-70'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
            disabled={activity.availableSlots === 0 || isBooking}
          >
            {isBooking ? 'Booking...' : activity.availableSlots > 0 ? 'Book Now' : 'Fully Booked'}
          </button>
        </div>

        {/* Animated corner accents */}
        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full transition-all duration-500 ${isHovered ? 'scale-150' : 'scale-100'}`} />
        <div className={`absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-pink-500/20 to-transparent rounded-tr-full transition-all duration-500 ${isHovered ? 'scale-150' : 'scale-100'}`} />
      </div>
    </div>
  );
}
