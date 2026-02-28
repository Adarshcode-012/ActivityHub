// Trigger TS refresh
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authenticate, requireAdmin } from '@/lib/middleware';

const activitySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  date: z.string().datetime('Invalid date format'),
  capacity: z.number().int().positive('Capacity must be a positive number'),
});

// GET /api/activities - List all activities
export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { date: 'asc' },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    // Add available slots to each activity
    const activitiesWithSlots = activities.map((activity) => ({
      ...activity,
      availableSlots: activity.capacity - activity._count.bookings,
    }));

    return NextResponse.json(activitiesWithSlots);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/activities - Create new activity (admin only)
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const user = authenticate(req);

    // Require admin role
    requireAdmin(user);

    const body = await req.json();
    const { title, description, date, capacity, imageUrl } = activitySchema.parse(body);

    let finalImageUrl = imageUrl;

    // Automatically fetch an image from Unsplash if not provided
    if (!finalImageUrl) {
      try {
        const query = encodeURIComponent(title);
        const unsplashRes = await fetch(`https://unsplash.com/napi/search/photos?query=${query}&per_page=1&page=1`);
        if (unsplashRes.ok) {
          const unsplashData = await unsplashRes.json();
          if (unsplashData.results && unsplashData.results.length > 0) {
            finalImageUrl = unsplashData.results[0].urls.regular;
          }
        }
      } catch (err) {
        console.error('Failed to automatically fetch image from Unsplash:', err);
      }
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        description,
        imageUrl: finalImageUrl || null,
        date: new Date(date),
        capacity,
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message.includes('authorization')) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }
      if (error.message.includes('Admin')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }

    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
