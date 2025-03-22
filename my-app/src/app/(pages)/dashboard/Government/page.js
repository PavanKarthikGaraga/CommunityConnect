'use client';
import { useAuth } from '@/AuthContext/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GovernmentDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    } else if (user.role !== 'Government') {
      router.push(`/dashboard/${user.role}`);
    }
  }, [user, router]);

  if (!user || user.role !== 'Government') {
    return null;
  }

  return (
    <div className="dashboard-content">
      <h1>Welcome, {user?.name}</h1>
      <div className="dashboard-stats">
        {/* Add Government-specific content here */}
      </div>
    </div>
  );
}