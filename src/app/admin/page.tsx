/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createActivity, deleteActivity, getActivityBookings, updateBookingCompletion, ApiError, ActivityData } from '@/lib/api';

interface Booking {
    id: string;
    isCompleted: boolean;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
}

interface Activity {
    id: string;
    title: string;
    description: string | null;
    imageUrl?: string | null;
    date: string;
    capacity: number;
    availableSlots: number;
}

export default function AdminDashboard() {
    const { user, token, isAuthenticated } = useAuth();
    const router = useRouter();

    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [formData, setFormData] = useState<ActivityData>({
        title: '',
        description: '',
        date: '',
        capacity: 10,
    });
    const [isCreating, setIsCreating] = useState(false);
    const [formError, setFormError] = useState('');

    // Booking states
    const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null);
    const [activityBookings, setActivityBookings] = useState<Record<string, Booking[]>>({});
    const [loadingBookings, setLoadingBookings] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Initial Auth Guard Check
        if (!isAuthenticated) return;

        // Server validation needed, but client check first for fast redirect
        if (user?.role !== 'admin') {
            router.push('/');
            return;
        }

        fetchActivities();
    }, [user, isAuthenticated, router]);

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

    const handleCreateActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setIsCreating(true);

        try {
            // Create new activity, backend will auto-fetch Unsplash image
            await createActivity({
                ...formData,
                date: new Date(formData.date).toISOString()
            }, token!);

            // Reset form on success and refresh list
            setFormData({ title: '', description: '', date: '', capacity: 10 });
            await fetchActivities();
            alert('Activity successfully created!');
        } catch (err) {
            setFormError(err instanceof ApiError ? err.message : 'Failed to create activity');
        } finally {
            setIsCreating(false);
        }
    };

    const toggleBookings = async (activityId: string) => {
        if (expandedActivityId === activityId) {
            setExpandedActivityId(null);
            return;
        }

        setExpandedActivityId(activityId);

        if (!activityBookings[activityId]) {
            setLoadingBookings(prev => ({ ...prev, [activityId]: true }));
            try {
                const bookings = await getActivityBookings(activityId, token!);
                setActivityBookings(prev => ({ ...prev, [activityId]: bookings }));
            } catch (err) {
                alert(err instanceof ApiError ? err.message : 'Failed to fetch bookings');
            } finally {
                setLoadingBookings(prev => ({ ...prev, [activityId]: false }));
            }
        }
    };

    const handleToggleCompletion = async (activityId: string, bookingId: string, currentStatus: boolean) => {
        try {
            await updateBookingCompletion(bookingId, !currentStatus, token!);
            // Update local state
            setActivityBookings(prev => ({
                ...prev,
                [activityId]: prev[activityId].map(b =>
                    b.id === bookingId ? { ...b, isCompleted: !currentStatus } : b
                )
            }));
        } catch (err) {
            alert(err instanceof ApiError ? err.message : 'Failed to update booking status');
        }
    };

    const handleDeleteActivity = async (activityId: string) => {
        if (!confirm('Are you sure you want to permanently delete this activity?')) return;

        try {
            await deleteActivity(activityId, token!);
            await fetchActivities(); // refresh the list
        } catch (err) {
            alert(err instanceof ApiError ? err.message : 'Failed to delete activity');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border border-[var(--gold-accent)] border-t-transparent animate-spin-slow rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Navigation />

            <div className="pt-32 px-6 max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-foreground">
                        Admin Dashboard
                    </h1>
                    <p className="text-foreground/50 mt-4 text-sm">Create and manage activities across the platform.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Create Form Container */}
                    <div className="lg:col-span-1">
                        <div className="bg-card-bg border border-border-color p-8 sticky top-32">
                            <h2 className="text-2xl font-serif text-[var(--gold-accent)] mb-6">New Activity</h2>

                            {formError && (
                                <div className="mb-6 p-4 border border-red-500/20 bg-red-500/5">
                                    <p className="text-red-500/80 text-xs text-center">{formError}</p>
                                </div>
                            )}

                            <form onSubmit={handleCreateActivity} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-widest mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-0 py-3 bg-transparent border-b border-border-color text-foreground focus:outline-none focus:border-[var(--gold-accent)] transition-colors"
                                        placeholder="e.g. Sunset Yoga"
                                    />
                                    <p className="text-[10px] text-foreground/40 mt-1">*An image will automatically be fetched from Unsplash using this title.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-widest mb-2">
                                        Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-0 py-3 bg-transparent border-b border-border-color text-foreground focus:outline-none focus:border-[var(--gold-accent)] transition-colors [color-scheme:dark]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-widest mb-2">
                                        Capacity
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min={1}
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                                        className="w-full px-0 py-3 bg-transparent border-b border-border-color text-foreground focus:outline-none focus:border-[var(--gold-accent)] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-widest mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-0 py-3 bg-transparent border-b border-border-color text-foreground focus:outline-none focus:border-[var(--gold-accent)] transition-colors resize-none"
                                        placeholder="Enter activity details..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="w-full mt-4 py-3 bg-[var(--gold-accent)] text-white text-sm font-medium hover:bg-[var(--gold-accent-hover)] transition-colors duration-300 rounded-md disabled:opacity-50"
                                >
                                    {isCreating ? 'Creating Activity...' : 'Create Activity'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Activities List Container */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-serif text-foreground mb-6">Manage Existing Activities</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}

                        <div className="space-y-6">
                            {activities.length === 0 ? (
                                <div className="p-10 border border-border-color text-center">
                                    <p className="text-foreground/50">No activities found.</p>
                                </div>
                            ) : (
                                activities.map(activity => (
                                    <div key={activity.id} className="flex flex-col sm:flex-row gap-6 p-6 border border-border-color bg-card-bg hover:border-[var(--gold-accent)] transition-colors">

                                        {/* Activity Image Thumbnail */}
                                        <div className="w-full sm:w-40 h-32 bg-black/50 shrink-0">
                                            <img
                                                src={activity.imageUrl || 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=400&q=80'}
                                                alt={activity.title}
                                                className="w-full h-full object-cover grayscale-[30%]"
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-serif text-foreground">{activity.title}</h3>
                                                    <span className="text-xs font-semibold px-2 py-1 bg-foreground/5 text-foreground/70 rounded border border-border-color">
                                                        {activity.availableSlots} / {activity.capacity} spots
                                                    </span>
                                                </div>
                                                <p className="text-sm text-foreground/60 line-clamp-2 mb-4">
                                                    {activity.description || 'No description provided.'}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-center text-xs mt-4 pt-4 border-t border-border-color">
                                                <button
                                                    onClick={() => toggleBookings(activity.id)}
                                                    className="text-[var(--gold-accent)] hover:text-foreground font-semibold uppercase tracking-wider transition-colors"
                                                >
                                                    {expandedActivityId === activity.id ? 'Hide Bookings' : 'View Bookings'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteActivity(activity.id)}
                                                    className="text-red-500 hover:text-red-400 font-semibold uppercase tracking-wider transition-colors"
                                                >
                                                    Delete Activity
                                                </button>
                                            </div>

                                            {expandedActivityId === activity.id && (
                                                <div className="mt-6 border-t border-border-color pt-4">
                                                    <h4 className="text-sm font-serif text-[var(--gold-accent)] mb-4">Bookings</h4>
                                                    {loadingBookings[activity.id] ? (
                                                        <p className="text-xs text-foreground/50">Loading...</p>
                                                    ) : !activityBookings[activity.id] || activityBookings[activity.id].length === 0 ? (
                                                        <p className="text-xs text-foreground/50">No bookings yet.</p>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {activityBookings[activity.id].map(booking => (
                                                                <div key={booking.id} className="flex items-center justify-between bg-background/50 p-3 border border-border-color">
                                                                    <div>
                                                                        <p className="text-sm font-medium">{booking.user.name}</p>
                                                                        <p className="text-xs text-foreground/50">{booking.user.email}</p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleToggleCompletion(activity.id, booking.id, booking.isCompleted)}
                                                                        className={`px-3 py-1 text-[10px] uppercase tracking-widest font-semibold border transition-colors ${booking.isCompleted
                                                                            ? 'bg-[var(--gold-accent)] text-white border-[var(--gold-accent)]'
                                                                            : 'text-foreground/50 border-border-color hover:border-foreground/50'
                                                                            }`}
                                                                    >
                                                                        {booking.isCompleted ? 'Completed' : 'Mark Done'}
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
