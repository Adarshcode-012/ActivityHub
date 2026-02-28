import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticate } from '@/lib/middleware';

// GET /api/bookings/me - Get logged-in user's bookings
export async function GET(req: NextRequest) {
  try {
    const user = authenticate(req);

    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        activity: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            capacity: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    if (error instanceof Error && error.message.includes('authorization')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error('Error fetching user bookings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
