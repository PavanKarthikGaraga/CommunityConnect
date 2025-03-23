import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { Task } from '@/config/schema';
import { verifyToken } from '@/config/jwt';
import { cookies } from 'next/headers';

// Get tasks for a volunteer
export async function GET(req) {
  try {
    await connectDB();
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all';

    let query = {};
    
    if (decoded.role === 'Volunteer') {
      switch (filter) {
        case 'available':
          query = { status: 'Available', assignedTo: null };
          break;
        case 'accepted':
          query = { assignedTo: decoded.id, status: 'In Progress' };
          break;
        case 'completed':
          query = { assignedTo: decoded.id, status: { $in: ['Completed', 'Verified'] } };
          break;
        default:
          query = {
            $or: [
              { status: 'Available', assignedTo: null },
              { assignedTo: decoded.id }
            ]
          };
      }
    } else if (decoded.role === 'NGO') {
      query = { organization: decoded.id };
    }

    const tasks = await Task.find(query)
      .populate('project', 'title')
      .populate('assignedTo', 'name')
      .populate('organization', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Tasks fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'NGO') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const task = await Task.create({
      ...data,
      organization: decoded.id,
      status: 'Available'
    });

    return NextResponse.json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Task creation error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

// Accept or update task status
export async function PATCH(req) {
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

    const { taskId, action, hours } = await req.json();

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Handle different actions
    switch (action) {
      case 'accept':
        if (task.assignedTo) {
          return NextResponse.json(
            { error: 'Task is already assigned' },
            { status: 400 }
          );
        }
        task.assignedTo = decoded.id;
        task.status = 'Assigned';
        break;

      case 'start':
        if (task.assignedTo.toString() !== decoded.id) {
          return NextResponse.json(
            { error: 'Not authorized to start this task' },
            { status: 403 }
          );
        }
        task.status = 'In Progress';
        break;

      case 'complete':
        if (task.assignedTo.toString() !== decoded.id) {
          return NextResponse.json(
            { error: 'Not authorized to complete this task' },
            { status: 403 }
          );
        }
        task.status = 'Completed';
        task.completedAt = new Date();
        task.hoursLogged = hours || task.hoursLogged;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    await task.save();

    return NextResponse.json({
      message: `Task ${action}ed successfully`,
      task
    });
  } catch (error) {
    console.error('Task update error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
} 