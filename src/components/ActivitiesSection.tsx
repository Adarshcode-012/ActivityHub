'use client';

import { useEffect, useState } from 'react';
import ActivityCard from './ActivityCard';

interface Activity {
  id: string;
  title: string;
  description: string | null;
  imageUrl?: string | null;
  date: string;
  capacity: number;
  availableSlots: number;
}

export default function ActivitiesSection() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities');
      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="activities" className="relative py-32 px-6 bg-background">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-foreground">
            Featured Activities
          </h2>
          <p className="text-sm text-foreground/50 max-w-2xl mx-auto leading-loose border-t border-border-color pt-6 inline-block">
            Explore our curated collection of amazing experiences and book your next adventure
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border border-[var(--gold-accent)] border-t-transparent animate-spin-slow rounded-full" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="border border-red-500/20 bg-red-500/5 p-6 text-center">
            <p className="text-red-500/80 text-sm tracking-widest uppercase">{error}</p>
            <button
              onClick={fetchActivities}
              className="mt-4 px-6 py-2 border border-red-500/20 hover:border-red-500/40 text-red-500/80 text-xs tracking-widest uppercase transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Activities grid */}
        {!loading && !error && (
          <>
            {activities.length === 0 ? (
              <div className="text-center py-20 border-y border-border-color">
                <p className="text-foreground/50 text-sm">Check back soon for new experiences!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ActivityCard activity={activity} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
