import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authenticate, requireAdmin } from '@/lib/middleware';

const activityUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  date: z.string().datetime().optional(),
  capacity: z.number().int().positive().optional(),
});

// GET /api/activities/:id - Get single activity
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const activity = await prisma.activity.findUnique({
      where: { id },
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

    const activityWithSlots = {
      ...activity,
      availableSlots: activity.capacity - activity._count.bookings,
    };

    return NextResponse.json(activityWithSlots);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/activities/:id - Update activity (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = authenticate(req);
    requireAdmin(user);

    const body = await req.json();
    const data = activityUpdateSchema.parse(body);

    const activity = await prisma.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }

    const updatedActivity = await prisma.activity.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    });

    return NextResponse.json(updatedActivity);
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

    console.error('Error updating activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/activities/:id - Delete activity (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = authenticate(req);
    requireAdmin(user);

    const activity = await prisma.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }

    await prisma.activity.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('authorization')) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }
      if (error.message.includes('Admin')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }

    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
