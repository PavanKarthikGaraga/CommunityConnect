'use client';
import { useAuth } from '@/AuthContext/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaHome,
  FaTree, 
  FaCalendarAlt, 
  FaMedal,
  FaUserCircle,
  FaClock,
  FaBell,
  FaChartLine,
  FaCog
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import './page.css';

const dummyData = {
  stats: {
    treesPlanted: 45,
    eventsAttended: 12,
    volunteerHours: 156,
    upcomingEvents: 3
  },
  activityData: [
    { month: 'Jan', hours: 20 },
    { month: 'Feb', hours: 35 },
    { month: 'Mar', hours: 25 },
    { month: 'Apr', hours: 45 },
    { month: 'May', hours: 30 },
    { month: 'Jun', hours: 50 }
  ],
  upcomingEvents: [
    { id: 1, name: "Beach Cleanup Drive", date: "2024-04-22", location: "Miami Beach" },
    { id: 2, name: "Tree Planting Day", date: "2024-04-25", location: "City Park" },
    { id: 3, name: "Wildlife Conservation", date: "2024-05-01", location: "Nature Reserve" }
  ],
  recentBadges: [
    { id: 1, name: "Tree Champion", icon: "🌳", date: "2024-03-15" },
    { id: 2, name: "Beach Guardian", icon: "🏖️", date: "2024-03-01" },
    { id: 3, name: "Wildlife Protector", icon: "🦁", date: "2024-02-15" }
  ]
};

export default function VolunteerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (!loading && user && user.role !== 'Volunteer') {
      router.push(`/dashboard/${user.role}`);
    }
  }, [user, loading, router]);

  if (loading) return <div className="dashboard-loading">Loading...</div>;
  if (!user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="dashboard-header">
              <h1>Welcome, {user?.name || 'Volunteer'}!</h1>
              <p>Your volunteer journey at a glance</p>
            </div>

            <div className="dashboard-content">
              {/* Stats Cards */}
              <div className="stats-container">
                <div className="stat-card">
                  <FaTree className="stat-icon" />
                  <div className="stat-info">
                    <h3>Trees Planted</h3>
                    <p>{dummyData.stats.treesPlanted}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <FaCalendarAlt className="stat-icon" />
                  <div className="stat-info">
                    <h3>Events Attended</h3>
                    <p>{dummyData.stats.eventsAttended}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <FaClock className="stat-icon" />
                  <div className="stat-info">
                    <h3>Volunteer Hours</h3>
                    <p>{dummyData.stats.volunteerHours}</p>
                  </div>
                </div>
              </div>

              {/* Activity Chart */}
              <div className="chart-container">
                <h2>Your Activity</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dummyData.activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="hours" 
                      stroke="#0088FE" 
                      strokeWidth={2}
                      dot={{ fill: '#0088FE' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="secondary-content">
                {/* Upcoming Events */}
                <div className="events-container">
                  <h2>Upcoming Events</h2>
                  <div className="events-list">
                    {dummyData.upcomingEvents.map(event => (
                      <div key={event.id} className="event-card">
                        <div className="event-date">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="event-details">
                          <h3>{event.name}</h3>
                          <p>{event.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Badges */}
                <div className="badges-container">
                  <h2>Recent Achievements</h2>
                  <div className="badges-list">
                    {dummyData.recentBadges.map(badge => (
                      <div key={badge.id} className="badge-card">
                        <span className="badge-icon">{badge.icon}</span>
                        <div className="badge-info">
                          <h3>{badge.name}</h3>
                          <p>Earned {new Date(badge.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'profile':
        return (
          <div className="dashboard-section">
            <h1>Your Profile</h1>
            <div className="profile-content">
              <p>Profile information and settings would appear here.</p>
            </div>
          </div>
        );
      case 'events':
        return (
          <div className="dashboard-section">
            <h1>Events</h1>
            <div className="events-content">
              <p>All upcoming and past events would appear here.</p>
            </div>
          </div>
        );
      case 'badges':
        return (
          <div className="dashboard-section">
            <h1>Badges & Rewards</h1>
            <div className="badges-content">
              <p>All your badges and rewards would appear here.</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="dashboard-section">
            <h1>Analytics</h1>
            <div className="analytics-content">
              <p>Detailed analytics about your contributions would appear here.</p>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="dashboard-section">
            <h1>Notifications</h1>
            <div className="notifications-content">
              <p>Your notifications would appear here.</p>
            </div>
          </div>
        );
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="volunteer-dashboard-container">
      <aside className="dashboard-sidebar">
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaHome />
            <span className="nav-text">Dashboard</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUserCircle />
            <span className="nav-text">Profile</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <FaCalendarAlt />
            <span className="nav-text">Events</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveTab('badges')}
          >
            <FaMedal />
            <span className="nav-text">Badges</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <FaChartLine />
            <span className="nav-text">Analytics</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <FaBell />
            <span className="nav-text">Notifications</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog />
            <span className="nav-text">Settings</span>
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        {renderContent()}
      </main>
    </div>
  );
}