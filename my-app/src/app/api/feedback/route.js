import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import { Feedback } from '@/config/schema';
import { verifyToken } from '@/config/jwt';
import { cookies } from 'next/headers';

// Get feedback for a user
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
    const type = searchParams.get('type');

    // Build query
    let query = {
      $or: [
        { from: decoded.id },
        { to: decoded.id }
      ]
    };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    const feedback = await Feedback.find(query)
      .populate('from', 'name email organization')
      .populate('to', 'name email organization')
      .populate('project', 'title')
      .populate('task', 'title')
      .sort({ createdAt: -1 });

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Feedback fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

// Submit new feedback
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

    const { to, project, task, type, subject, message } = await req.json();

    // Create feedback
    const feedback = await Feedback.create({
      from: decoded.id,
      to,
      project,
      task,
      type,
      subject,
      message,
      status: 'Pending'
    });

    await feedback.populate([
      { path: 'from', select: 'name email organization' },
      { path: 'to', select: 'name email organization' },
      { path: 'project', select: 'title' },
      { path: 'task', select: 'title' }
    ]);

    return NextResponse.json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Feedback creation error:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

// Update feedback (respond to feedback)
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

    const { feedbackId, response, status } = await req.json();

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to respond
    if (feedback.to.toString() !== decoded.id) {
      return NextResponse.json(
        { error: 'Not authorized to respond to this feedback' },
        { status: 403 }
      );
    }

    // Update feedback
    feedback.response = {
      message: response,
      respondedBy: decoded.id,
      respondedAt: new Date()
    };
    feedback.status = status || 'Resolved';

    await feedback.save();
    await feedback.populate([
      { path: 'from', select: 'name email organization' },
      { path: 'to', select: 'name email organization' },
      { path: 'project', select: 'title' },
      { path: 'task', select: 'title' },
      { path: 'response.respondedBy', select: 'name email organization' }
    ]);

    return NextResponse.json({
      message: 'Feedback updated successfully',
      feedback
    });
  } catch (error) {
    console.error('Feedback update error:', error);
    return NextResponse.json(
      { error: 'Failed to update feedback' },
      { status: 500 }
    );
  }
} 