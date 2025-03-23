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

    if (!session || !session.user || session.user.role !== 'Government') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get project approval stats
    const projectStats = await Event.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get NGO participation stats
    const ngoStats = await Event.aggregate([
      {
        $group: {
          _id: '$organizer',
          eventCount: { $sum: 1 },
          totalParticipants: { $sum: { $size: '$participants' } }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'ngoInfo'
        }
      }
    ]);

    // Get regional impact metrics
    const regionalImpact = await Contribution.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'eventInfo'
        }
      },
      {
        $unwind: '$eventInfo'
      },
      {
        $group: {
          _id: '$eventInfo.location',
          treesPlanted: { $sum: '$metrics.treesPlanted' },
          hoursContributed: { $sum: '$metrics.hoursContributed' },
          areaCleanedSqM: { $sum: '$metrics.areaCleanedSqM' },
          eventCount: { $sum: 1 },
          volunteerCount: { $addToSet: '$user' }
        }
      },
      {
        $project: {
          location: '$_id',
          treesPlanted: 1,
          hoursContributed: 1,
          areaCleanedSqM: 1,
          eventCount: 1,
          volunteerCount: { $size: '$volunteerCount' }
        }
      },
      { $sort: { eventCount: -1 } },
      { $limit: 5 }
    ]);

    // Get monthly trends
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrends = await Event.aggregate([
      {
        $match: {
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
          ngos: { $addToSet: '$organizer' },
          volunteers: { $sum: { $size: '$participants' } }
        }
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          events: 1,
          ngoCount: { $size: '$ngos' },
          volunteers: 1
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    // Get pending approvals
    const pendingApprovals = await Event.find({ status: 'pending' })
      .populate('organizer', 'name')
      .sort({ date: 1 })
      .limit(5);

    const dashboardData = {
      projectStats: {
        total: projectStats.reduce((acc, curr) => acc + curr.count, 0),
        pending: projectStats.find(s => s._id === 'pending')?.count || 0,
        approved: projectStats.find(s => s._id === 'approved')?.count || 0,
        rejected: projectStats.find(s => s._id === 'rejected')?.count || 0
      },
      ngoStats: {
        totalNGOs: ngoStats.length,
        totalEvents: ngoStats.reduce((acc, curr) => acc + curr.eventCount, 0),
        totalParticipants: ngoStats.reduce((acc, curr) => acc + curr.totalParticipants, 0),
        topNGOs: ngoStats
          .sort((a, b) => b.eventCount - a.eventCount)
          .slice(0, 5)
          .map(ngo => ({
            name: ngo.ngoInfo[0]?.name || 'Unknown NGO',
            eventCount: ngo.eventCount,
            participantCount: ngo.totalParticipants
          }))
      },
      regionalImpact: regionalImpact.map(region => ({
        location: region.location,
        treesPlanted: region.treesPlanted,
        hoursContributed: region.hoursContributed,
        areaCleanedSqM: region.areaCleanedSqM,
        eventCount: region.eventCount,
        volunteerCount: region.volunteerCount
      })),
      monthlyTrends: monthlyTrends.map(trend => ({
        month: new Date(trend.year, trend.month - 1).toLocaleString('default', { month: 'short' }),
        events: trend.events,
        ngoCount: trend.ngoCount,
        volunteers: trend.volunteers
      })),
      pendingApprovals: pendingApprovals.map(event => ({
        id: event._id,
        name: event.name,
        ngo: event.organizer.name,
        date: event.date,
        location: event.location,
        type: event.type
      }))
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Government Dashboard data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 