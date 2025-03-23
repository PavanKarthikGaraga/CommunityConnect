'use client';
import { useAuth } from '@/AuthContext/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaHome,
  FaCheckCircle,
  FaChartBar,
  FaHandshake,
  FaBalanceScale,
  FaBullhorn,
  FaSpinner,
  FaBuilding,
  FaUsers,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaLeaf
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
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import '../dashboard-shared.css';
import './page.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function GovernmentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (!loading && user && user.role !== 'Government') {
      router.push(`/dashboard/${user.role}`);
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/government/dashboard');
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
              <h1>Welcome, {user?.name || 'Administrator'}!</h1>
              <p>Monitor and manage environmental initiatives</p>
            </div>

            <div className="dashboard-content">
              {/* Project Stats */}
              <div className="stats-container">
                <div className="stat-card">
                  <FaCheckCircle className="stat-icon" />
                  <div className="stat-info">
                    <h3>Project Approvals</h3>
                    <p>{dashboardData?.projectStats.total || 0}</p>
                    <div className="stat-details">
                      <span>Pending: {dashboardData?.projectStats.pending || 0}</span>
                      <span>Approved: {dashboardData?.projectStats.approved || 0}</span>
                      <span>Rejected: {dashboardData?.projectStats.rejected || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="stat-card">
                  <FaBuilding className="stat-icon" />
                  <div className="stat-info">
                    <h3>NGO Participation</h3>
                    <p>{dashboardData?.ngoStats.totalNGOs || 0}</p>
                    <div className="stat-details">
                      <span>Total Events: {dashboardData?.ngoStats.totalEvents || 0}</span>
                      <span>Total Participants: {dashboardData?.ngoStats.totalParticipants || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="charts-container">
                {/* Monthly Trends */}
                <div className="chart-wrapper">
                  <h2>Monthly Trends</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData?.monthlyTrends || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="events"
                        stroke="#0088FE"
                        name="Events"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="volunteers"
                        stroke="#00C49F"
                        name="Volunteers"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Regional Impact */}
                <div className="chart-wrapper">
                  <h2>Regional Impact</h2>
                  <div className="regional-impact">
                    {dashboardData?.regionalImpact.map((region, index) => (
                      <div key={region.location} className="region-card">
                        <h3>{region.location}</h3>
                        <div className="region-stats">
                          <div className="region-stat">
                            <FaLeaf className="stat-icon" />
                            <span>{region.treesPlanted} trees</span>
                          </div>
                          <div className="region-stat">
                            <FaUsers className="stat-icon" />
                            <span>{region.volunteerCount} volunteers</span>
                          </div>
                          <div className="region-stat">
                            <FaCalendarAlt className="stat-icon" />
                            <span>{region.eventCount} events</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="approvals-section">
                <h2>Pending Approvals</h2>
                <div className="approvals-grid">
                  {dashboardData?.pendingApprovals.map(event => (
                    <div key={event.id} className="approval-card">
                      <div className="approval-header">
                        <h3>{event.name}</h3>
                        <span className="event-type">{event.type}</span>
                      </div>
                      <div className="approval-details">
                        <p><FaBuilding /> {event.ngo}</p>
                        <p><FaCalendarAlt /> {new Date(event.date).toLocaleDateString()}</p>
                        <p><FaMapMarkerAlt /> {event.location}</p>
                      </div>
                      <div className="approval-actions">
                        <button className="approve-btn">Approve</button>
                        <button className="reject-btn">Reject</button>
                      </div>
                    </div>
                  ))}
                  {(!dashboardData?.pendingApprovals || dashboardData.pendingApprovals.length === 0) && (
                    <p className="no-data">No pending approvals</p>
                  )}
                </div>
              </div>
            </div>
          </>
        );
      case 'approvals':
        return (
          <div className="dashboard-section">
            <h1>Project Approvals</h1>
            <p>Detailed project approval interface will be implemented here.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="dashboard-section">
            <h1>Analytics & Reports</h1>
            <p>Detailed analytics and reporting interface will be implemented here.</p>
          </div>
        );
      case 'collaboration':
        return (
          <div className="dashboard-section">
            <h1>NGO Collaboration</h1>
            <p>NGO collaboration interface will be implemented here.</p>
          </div>
        );
      case 'compliance':
        return (
          <div className="dashboard-section">
            <h1>Compliance Management</h1>
            <p>Compliance management interface will be implemented here.</p>
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
    <div className="government-dashboard-container">
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
            className={`nav-item ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => setActiveTab('approvals')}
          >
            <FaCheckCircle />
            <span className="nav-text">Approvals</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <FaChartBar />
            <span className="nav-text">Analytics</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'collaboration' ? 'active' : ''}`}
            onClick={() => setActiveTab('collaboration')}
          >
            <FaHandshake />
            <span className="nav-text">Collaboration</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'compliance' ? 'active' : ''}`}
            onClick={() => setActiveTab('compliance')}
          >
            <FaBalanceScale />
            <span className="nav-text">Compliance</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'communication' ? 'active' : ''}`}
            onClick={() => setActiveTab('communication')}
          >
            <FaBullhorn />
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