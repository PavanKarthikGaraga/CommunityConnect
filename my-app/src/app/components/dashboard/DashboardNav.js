'use client';
import { useAuth } from '@/AuthContext/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { FiUser, FiLogOut } from 'react-icons/fi';
import './DashboardNav.css';

export default function DashboardNav() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="dashboard-nav">
      <div className="dashboard-nav-container">
        <div className="dashboard-nav-left">
          <Link href="/dashboard" className="dashboard-logo">
            CommunityConnect
          </Link>
          <span className="role-badge">{user?.role || 'User'}</span>
        </div>

        <div className="dashboard-nav-right">
          <div className="user-profile">
            <span className="user-name">{user?.name || 'User'}</span>
            {user?.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.name || 'Profile'}
                width={40}
                height={40}
                className="profile-image"
                unoptimized
              />
            ) : (
              <div className="profile-placeholder">
                <FiUser size={20} />
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="logout-button">
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
} 