'use client';
import { useAuth } from '@/AuthContext/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaHome,
  FaProjectDiagram,
  FaUsers,
  FaChartBar,
  FaCalendarAlt,
  FaEnvelope,
  FaSpinner,
  FaLeaf,
  FaClock,
  FaMapMarkerAlt
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import '../dashboard-shared.css';
import './page.css';

export default function NGODashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (!loading && user && user.role !== 'NGO') {
      router.push(`/dashboard/${user.role}`);
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/ngo/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && !loading) {
      fetchDashboardData();
    }
  }, [user, loading]);

  if (loading || isLoading) {
    return (
      <div className="dashboard-loading">
        <FaSpinner className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="dashboard-header">
              <h1>Welcome, {user?.name || 'NGO'}!</h1>
              <p>Manage your projects and track your impact</p>
            </div>

            <div className="dashboard-content">
              {/* Project Stats */}
              <div className="stats-container">
                <div className="stat-card">
                  <FaProjectDiagram className="stat-icon" />
                  <div className="stat-info">
                    <h3>Total Projects</h3>
                    <p>{dashboardData?.projectStats.total || 0}</p>
                    <div className="stat-details">
                      <span>Upcoming: {dashboardData?.projectStats.upcoming || 0}</span>
                      <span>Ongoing: {dashboardData?.projectStats.ongoing || 0}</span>
                      <span>Completed: {dashboardData?.projectStats.completed || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="stat-card">
                  <FaUsers className="stat-icon" />
                  <div className="stat-info">
                    <h3>Volunteer Base</h3>
                    <p>{dashboardData?.volunteerStats.totalVolunteers || 0}</p>
                    <div className="stat-details">
                      <span>Total Participations: {dashboardData?.volunteerStats.totalParticipations || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="stat-card">
                  <FaLeaf className="stat-icon" />
                  <div className="stat-info">
                    <h3>Impact Metrics</h3>
                    <div className="stat-details">
                      <span>Trees: {dashboardData?.impactMetrics.treesPlanted || 0}</span>
                      <span>Hours: {dashboardData?.impactMetrics.hoursContributed || 0}</span>
                      <span>Area Cleaned: {dashboardData?.impactMetrics.areaCleanedSqM || 0}m²</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Charts */}
              <div className="charts-container">
                <div className="chart-wrapper">
                  <h2>Monthly Activity</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData?.monthlyActivity || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="events" fill="#0088FE" name="Events" />
                      <Bar yAxisId="right" dataKey="participants" fill="#00C49F" name="Participants" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Events */}
              <div className="recent-events">
                <h2>Recent Events</h2>
                <div className="events-grid">
                  {dashboardData?.recentEvents.map(event => (
                    <div key={event.id} className="event-card">
                      <div className="event-header">
                        <h3>{event.name}</h3>
                        <span className={`status-badge ${event.status}`}>{event.status}</span>
                      </div>
                      <div className="event-details">
                        <p><FaCalendarAlt /> {new Date(event.date).toLocaleDateString()}</p>
                        <p><FaMapMarkerAlt /> {event.location}</p>
                        <p><FaUsers /> {event.participantCount} participants</p>
                      </div>
                      <div className="event-participants">
                        <h4>Recent Participants</h4>
                        <div className="participant-list">
                          {event.participants.slice(0, 3).map(participant => (
                            <div key={participant.id} className="participant-item">
                              <span>{participant.name}</span>
                              <span className={`status-badge ${participant.status}`}>
                                {participant.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
      case 'projects':
        return (
          <div className="dashboard-section">
            <h1>Project Management</h1>
            <p>Detailed project management interface will be implemented here.</p>
          </div>
        );
      case 'volunteers':
        return (
          <div className="dashboard-section">
            <h1>Volunteer Management</h1>
            <p>Volunteer management interface will be implemented here.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="dashboard-section">
            <h1>Analytics & Reports</h1>
            <p>Detailed analytics and reporting interface will be implemented here.</p>
          </div>
        );
      case 'events':
        return (
          <div className="dashboard-section">
            <h1>Event Management</h1>
            <p>Event management interface will be implemented here.</p>
          </div>
        );
      case 'communication':
        return (
          <div className="dashboard-section">
            <h1>Communication Hub</h1>
            <p>Communication interface will be implemented here.</p>
          </div>
        );
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="ngo-dashboard-container">
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
            className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FaProjectDiagram />
            <span className="nav-text">Projects</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'volunteers' ? 'active' : ''}`}
            onClick={() => setActiveTab('volunteers')}
          >
            <FaUsers />
            <span className="nav-text">Volunteers</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <FaChartBar />
            <span className="nav-text">Analytics</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <FaCalendarAlt />
            <span className="nav-text">Events</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'communication' ? 'active' : ''}`}
            onClick={() => setActiveTab('communication')}
          >
            <FaEnvelope />
            <span className="nav-text">Communication</span>
          </button>
        </nav>
      </aside>
      <main className="dashboard-main">
        {renderContent()}
      </main>
    </div>
  );
}