import Link from 'next/link';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>CommunityConnect</h3>
          <p>Connecting communities for positive change</p>
          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/projects">Browse Projects</Link></li>
            <li><Link href="/volunteers">Volunteer</Link></li>
            <li><Link href="/ngos">For NGOs</Link></li>
            <li><Link href="/government">Government Portal</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Resources</h3>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CommunityConnect. All rights reserved.</p>
      </div>
    </footer>
  );
} 