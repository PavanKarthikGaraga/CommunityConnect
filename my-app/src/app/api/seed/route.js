import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';
import connectDB from '@/config/db';

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Seeding is not allowed in production' },
      { status: 403 }
    );
  }

  try {
    await connectDB();
    const result = await seedDatabase();
    
    return NextResponse.json({
      message: 'Database seeded successfully',
      data: {
        ngoId: result.ngo._id,
        govtId: result.govt._id,
        volunteerIds: result.volunteers.map(v => v._id),
        projectIds: result.projects.map(p => p._id),
        taskIds: result.tasks.map(t => t._id)
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
} 