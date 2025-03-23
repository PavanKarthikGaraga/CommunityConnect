import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { Task } from '@/config/schema';
import { verifyToken } from '@/config/jwt';
import { cookies } from 'next/headers';

export async function PATCH(req, { params }) {
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

    const { id } = params;
    const { action } = await req.json();
    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    switch (action) {
      case 'accept':
        if (task.status !== 'Available' || task.assignedTo) {
          return NextResponse.json({ error: 'Task not available' }, { status: 400 });
        }
        task.status = 'In Progress';
        task.assignedTo = decoded.id;
        break;

      case 'complete':
        if (task.assignedTo.toString() !== decoded.id || task.status !== 'In Progress') {
          return NextResponse.json({ error: 'Unauthorized to complete this task' }, { status: 401 });
        }
        task.status = 'Completed';
        break;

      case 'verify':
        if (decoded.role !== 'NGO' || task.organization.toString() !== decoded.id) {
          return NextResponse.json({ error: 'Unauthorized to verify this task' }, { status: 401 });
        }
        task.status = 'Verified';
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await task.save();
    await task.populate('project', 'title');
    await task.populate('assignedTo', 'name');

    return NextResponse.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Task update error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
} 