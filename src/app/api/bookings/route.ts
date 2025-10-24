import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authenticate } from '@/lib/middleware';

const bookingSchema = z.object({
  activityId: z.string().min(1, 'Activity ID is required'),
});

// POST /api/bookings - Create a booking (authenticated users only)
export async function POST(req: NextRequest) {
  try {
    const user = authenticate(req);

    const body = await req.json();
    const { activityId } = bookingSchema.parse(body);

    // Check if activity exists
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }

    // Check if user already booked this activity
    const existingBooking = await prisma.booking.findUnique({
      where: {
        userId_activityId: {
          userId: user.userId,
          activityId,
        },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'You have already booked this activity' },
        { status: 400 }
      );
    }

    // Check if activity has available capacity
    if (activity._count.bookings >= activity.capacity) {
      return NextResponse.json(
        { error: 'Activity is fully booked' },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.userId,
        activityId,
      },
      include: {
        activity: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Booking created successfully',
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('authorization')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
