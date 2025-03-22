'use client';
import { useAuth } from '@/AuthContext/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VolunteerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (!loading && user && user.role !== 'Volunteer') {
      router.push(`/dashboard/${user.role}`);
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-content">
      <h1>Welcome, {user.name || 'Volunteer'}!</h1>
      <div className="dashboard-stats">
        {/* Add volunteer-specific content here */}
      </div>
    </div>
  );
}