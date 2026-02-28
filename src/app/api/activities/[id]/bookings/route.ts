import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticate, requireAdmin } from '@/lib/middleware';

// GET /api/activities/:id/bookings - Get all bookings for an activity (admin only)
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = authenticate(req);
        requireAdmin(user);

        const bookings = await prisma.booking.findMany({
            where: {
                activityId: id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        return NextResponse.json(bookings);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('authorization')) {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message.includes('Admin')) {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
        }

        console.error('Error fetching activity bookings:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
