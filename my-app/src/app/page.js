'use client';

import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import About from './assets/about.avif';
import FAQ from '../components/FAQ';

export default function Home() {
  return (
    <main>
      <Navbar />
      
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">🌟 Empowering Communities</span>
          <h1 className="slide-up">CommunityConnect</h1>
          <p className="slide-up">
            Connecting Volunteers, NGOs, and Government Bodies for 
            Meaningful Social Impact
          </p>
          <div className="hero-buttons">
            <a href="/signup" className="btn btn-primary slide-up">
              Get Started
            </a>
            <a href="/about" className="btn btn-secondary slide-up">
              Learn More
            </a>
          </div>
        </div>
      </section>

      <section className="mission">
        <div className="mission-content">
          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>We're building a world where community service is accessible, efficient, and impactful. Through technology and collaboration, we connect those who want to help with those who need it most.</p>
            <button className="btn btn-primary">Learn More</button>
          </div>
          <div className="mission-image">
            <Image 
              src={About} 
              alt="Community Impact" 
              fill 
              style={{objectFit: 'cover'}}
              priority
            />
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">5000+</div>
            <p>Active Volunteers</p>
          </div>
          <div className="stat-card">
            <div className="stat-number">1000+</div>
            <p>Projects Completed</p>
          </div>
          <div className="stat-card">
            <div className="stat-number">200+</div>
            <p>NGO Partners</p>
          </div>
          <div className="stat-card">
            <div className="stat-number">50+</div>
            <p>Cities Covered</p>
          </div>
        </div>
      </section>

      <section className="process">
        <div className="section-header">
          <span className="section-badge">Process</span>
          <h2>How It Works</h2>
          <p>Three simple steps to start making an impact</p>
        </div>
        <div className="process-steps">
          <div className="step-card">
            <span className="step-number">01</span>
            <div className="step-icon">👤</div>
            <h3>Create Profile</h3>
            <p>Sign up and tell us about your interests and skills. We'll help you find the perfect opportunities.</p>
          </div>
          <div className="step-card">
            <span className="step-number">02</span>
            <div className="step-icon">🤝</div>
            <h3>Get Matched</h3>
            <p>Our AI matches you with projects that align with your skills and interests.</p>
          </div>
          <div className="step-card">
            <span className="step-number">03</span>
            <div className="step-icon">⭐</div>
            <h3>Make Impact</h3>
            <p>Start contributing to meaningful projects and track your impact in real-time.</p>
          </div>
        </div>
      </section>

      <section className="blog">
        <div className="section-header">
          <span className="section-badge">Latest Updates</span>
          <h2>From Our Blog</h2>
          <p>Stories of impact and innovation</p>
        </div>
        <div className="blog-grid">
          <div className="blog-card">
            <div className="blog-image">
              <Image 
                src="/images/blog1.jpg" 
                alt="Community Garden" 
                fill 
                style={{objectFit: 'cover'}}
              />
            </div>
            <div className="blog-content">
              <span className="blog-tag">Success Story</span>
              <h3>Community Garden Initiative</h3>
              <p>How volunteers transformed an empty lot into a thriving community space</p>
              <a href="/blog/1" className="blog-link">Read More →</a>
            </div>
          </div>
          <div className="blog-card">
            <div className="blog-image">
              <Image 
                src="/images/blog2.jpg" 
                alt="Education Program" 
                fill 
                style={{objectFit: 'cover'}}
              />
            </div>
            <div className="blog-content">
              <span className="blog-tag">Education</span>
              <h3>Digital Literacy Program</h3>
              <p>Teaching essential digital skills to underserved communities</p>
              <a href="/blog/2" className="blog-link">Read More →</a>
            </div>
          </div>
          <div className="blog-card">
            <div className="blog-image">
              <Image 
                src="/images/blog3.jpg" 
                alt="Environmental Project" 
                fill 
                style={{objectFit: 'cover'}}
              />
            </div>
            <div className="blog-content">
              <span className="blog-tag">Environment</span>
              <h3>Beach Cleanup Drive</h3>
              <p>500 volunteers joined forces to clean our local beaches</p>
              <a href="/blog/3" className="blog-link">Read More →</a>
            </div>
          </div>
        </div>
      </section>

      <section className="collaborations">
        <div className="section-header">
          <span className="section-badge">Partners</span>
          <h2>Our Collaborations</h2>
          <p>Working together for greater impact</p>
        </div>
        <div className="partner-grid">
          {/* Add 6 partner logos */}
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div key={num} className="partner-logo">
              <Image 
                src={`/images/partner${num}.png`}
                alt={`Partner ${num}`}
                width={150}
                height={60}
                style={{objectFit: 'contain'}}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="faq">
        <div className="section-header">
          <span className="section-badge">FAQ</span>
          <h2>Common Questions</h2>
          <p>Everything you need to know</p>
        </div>
        <FAQ />
      </section>
      <Footer />
    </main>
  );
}
