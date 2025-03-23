import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { HoursLog, User } from '@/config/schema';
import { verifyToken } from '@/config/jwt';
import { cookies } from 'next/headers';

// Get hours logs for a volunteer
export async function GET(req) {
  try {
    await connectDB();

    // Get and verify token
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    let query = { volunteer: decoded.id };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const hoursLogs = await HoursLog.find(query)
      .populate('task', 'title')
      .populate('project', 'title')
      .populate('verifiedBy', 'name organization')
      .sort({ date: -1 });

    // Get total stats
    const stats = await HoursLog.aggregate([
      { $match: { volunteer: decoded.id, status: 'Approved' } },
      {
        $group: {
          _id: null,
          totalHours: { $sum: '$hours' },
          totalTasks: { $count: {} }
        }
      }
    ]);

    return NextResponse.json({
      hoursLogs,
      stats: stats[0] || { totalHours: 0, totalTasks: 0 }
    });
  } catch (error) {
    console.error('Hours logs fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hours logs' },
      { status: 500 }
    );
  }
}

// Log hours for a task
export async function POST(req) {
  try {
    await connectDB();

    // Get and verify token
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { taskId, projectId, hours, date, description } = await req.json();

    // Validate hours
    if (!hours || hours <= 0) {
      return NextResponse.json(
        { error: 'Invalid hours value' },
        { status: 400 }
      );
    }

    // Create hours log
    const hoursLog = await HoursLog.create({
      volunteer: decoded.id,
      task: taskId,
      project: projectId,
      hours,
      date: date || new Date(),
      description,
      status: 'Pending'
    });

    await hoursLog.populate([
      { path: 'task', select: 'title' },
      { path: 'project', select: 'title' }
    ]);

    return NextResponse.json({
      message: 'Hours logged successfully',
      hoursLog
    });
  } catch (error) {
    console.error('Hours log creation error:', error);
    return NextResponse.json(
      { error: 'Failed to log hours' },
      { status: 500 }
    );
  }
} 