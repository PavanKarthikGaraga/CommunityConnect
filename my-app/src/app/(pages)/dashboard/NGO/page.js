'use client';
import { useAuth } from '@/AuthContext/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NGODashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    } else if (user.role !== 'NGO') {
      router.push(`/dashboard/${user.role}`);
    }
  }, [user, router]);

  if (!user || user.role !== 'NGO') {
    return null;
  }

  return (
    <div className="dashboard-content">
      <h1>Welcome, {user?.name}</h1>
      <div className="dashboard-stats">
        {/* Add NGO-specific content here */}
      </div>
    </div>
  );
}