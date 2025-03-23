import DashboardNav from '@/app/components/dashboard/DashboardNav';
import DashboardFooter from '@/app/components/dashboard/DashboardFooter';
import './dashboard-layout.css';

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <DashboardNav />
      <main className="dashboard-main">
        {children}
      </main>
      <DashboardFooter />
    </div>
  );
} 