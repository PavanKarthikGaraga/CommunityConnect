import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/app/models/Event';
import Contribution from '@/app/models/Contribution';
import { UserAchievement } from '@/app/models/Achievement';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get stats
    const stats = await Contribution.aggregate([
      { $match: { user: userId, status: 'verified' } },
      {
        $group: {
          _id: null,
          totalTreesPlanted: { $sum: '$metrics.treesPlanted' },
          totalHours: { $sum: '$metrics.hoursContributed' },
          totalEvents: { $addToSet: '$event' }
        }
      }
    ]);

    // Get activity data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const activityData = await Contribution.aggregate([
      {
        $match: {
          user: userId,
          status: 'verified',
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          hours: { $sum: '$metrics.hoursContributed' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get upcoming events
    const upcomingEvents = await Event.find({
      date: { $gte: new Date() },
      'participants.user': userId,
      status: 'upcoming'
    })
    .sort({ date: 1 })
    .limit(5);

    // Get recent badges
    const recentBadges = await UserAchievement.find({ user: userId })
      .populate('achievement')
      .sort({ earnedAt: -1 })
      .limit(3);

    const dashboardData = {
      stats: {
        treesPlanted: stats[0]?.totalTreesPlanted || 0,
        eventsAttended: stats[0]?.totalEvents?.length || 0,
        volunteerHours: stats[0]?.totalHours || 0,
      },
      activityData: activityData.map(item => ({
        month: new Date(0, item._id.month - 1).toLocaleString('default', { month: 'short' }),
        hours: item.hours
      })),
      upcomingEvents: upcomingEvents.map(event => ({
        id: event._id,
        name: event.name,
        date: event.date,
        location: event.location
      })),
      recentBadges: recentBadges.map(ua => ({
        id: ua.achievement._id,
        name: ua.achievement.name,
        icon: ua.achievement.icon,
        date: ua.earnedAt
      }))
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 