import Link from 'next/link';
import './DashboardFooter.css';

export default function DashboardFooter() {
  return (
    <footer className="dashboard-footer">
      <div className="dashboard-footer-container">
        <div className="footer-left">
          <p className="copyright">
            © {new Date().getFullYear()} CommunityConnect. All rights reserved.
          </p>
        </div>
        
        <div className="footer-links">
          <Link href="/help">Help Center</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
} 