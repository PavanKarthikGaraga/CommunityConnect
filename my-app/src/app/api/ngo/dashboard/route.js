import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/app/models/Event';
import Contribution from '@/app/models/Contribution';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'NGO') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ngoId = session.user.id;

    // Get project stats
    const projectStats = await Event.aggregate([
      { $match: { organizer: ngoId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get volunteer stats
    const volunteerStats = await Event.aggregate([
      { $match: { organizer: ngoId } },
      { $unwind: '$participants' },
      {
        $group: {
          _id: null,
          totalVolunteers: { $addToSet: '$participants.user' },
          totalParticipations: { $sum: 1 }
        }
      }
    ]);

    // Get impact metrics
    const impactMetrics = await Contribution.aggregate([
      {
        $match: {
          event: {
            $in: (await Event.find({ organizer: ngoId }, '_id')).map(e => e._id)
          },
          status: 'verified'
        }
      },
      {
        $group: {
          _id: null,
          treesPlanted: { $sum: '$metrics.treesPlanted' },
          hoursContributed: { $sum: '$metrics.hoursContributed' },
          areaCleanedSqM: { $sum: '$metrics.areaCleanedSqM' }
        }
      }
    ]);

    // Get recent events
    const recentEvents = await Event.find({ organizer: ngoId })
      .sort({ date: -1 })
      .limit(5)
      .populate('participants.user', 'name email');

    // Get monthly activity data
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyActivity = await Event.aggregate([
      {
        $match: {
          organizer: ngoId,
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          events: { $sum: 1 },
          participants: { $sum: { $size: '$participants' } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const dashboardData = {
      projectStats: {
        total: projectStats.reduce((acc, curr) => acc + curr.count, 0),
        upcoming: projectStats.find(s => s._id === 'upcoming')?.count || 0,
        ongoing: projectStats.find(s => s._id === 'ongoing')?.count || 0,
        completed: projectStats.find(s => s._id === 'completed')?.count || 0
      },
      volunteerStats: {
        totalVolunteers: volunteerStats[0]?.totalVolunteers.length || 0,
        totalParticipations: volunteerStats[0]?.totalParticipations || 0
      },
      impactMetrics: {
        treesPlanted: impactMetrics[0]?.treesPlanted || 0,
        hoursContributed: impactMetrics[0]?.hoursContributed || 0,
        areaCleanedSqM: impactMetrics[0]?.areaCleanedSqM || 0
      },
      recentEvents: recentEvents.map(event => ({
        id: event._id,
        name: event.name,
        date: event.date,
        location: event.location,
        status: event.status,
        participantCount: event.participants.length,
        participants: event.participants.map(p => ({
          id: p.user._id,
          name: p.user.name,
          status: p.status
        }))
      })),
      monthlyActivity: monthlyActivity.map(item => ({
        month: new Date(0, item._id.month - 1).toLocaleString('default', { month: 'short' }),
        events: item.events,
        participants: item.participants
      }))
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('NGO Dashboard data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 