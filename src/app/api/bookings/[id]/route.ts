import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authenticate, requireAdmin } from '@/lib/middleware';

const bookingUpdateSchema = z.object({
    isCompleted: z.boolean(),
});

// PUT /api/bookings/:id - Update booking (admin only)
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = authenticate(req);
        requireAdmin(user);

        const body = await req.json();
        const data = bookingUpdateSchema.parse(body);

        const booking = await prisma.booking.findUnique({
            where: { id },
        });

        if (!booking) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: {
                isCompleted: data.isCompleted,
            },
        });

        return NextResponse.json(updatedBooking);
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

        console.error('Error updating booking:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
