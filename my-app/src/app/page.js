'use client';
import project1 from './assets/projects.avif';
import NGO from './assets/ngo.jpg';
import Blog from './assets/blog.webp';
import Image from 'next/image';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './assets/about.avif';
import FAQ from './components/FAQ';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Navbar />
      
      <section className="hero">
        <div className="hero-background">
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <div className="hero-content">
          <span className="hero-badge">
            <span className="pulse-dot"></span>
            Live Impact: 5000+ Volunteers Active Now
          </span>
          <h1 className="gradient-text">
            Make Change.<br/>
            Create Impact.<br/>
            Build Community.
          </h1>
          <p className="hero-description">
            Join a network of changemakers transforming communities through 
            meaningful collaboration and innovative social initiatives.
          </p>
          <div className="hero-buttons">
            <a href="/signup" className="btn btn-primary btn-glow">
              Start Making Impact
              <span className="btn-icon">→</span>
            </a>
            <a href="/about" className="btn btn-glass">
              Watch Our Story
              <span className="btn-icon">▶</span>
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat-pill">
              <span className="stat-icon">🌟</span>
              <span>4.9/5 Volunteer Rating</span>
            </div>
            <div className="stat-pill">
              <span className="stat-icon">🤝</span>
              <span>1000+ Projects</span>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mission">
        <div className="mission-content">
          <div className="mission-text">
            <span className="section-badge">
              <span className="badge-icon">🌟</span>
              Our Purpose
            </span>
            <h2 className="section-title">Transforming Communities Through Action</h2>
            <div className="mission-features">
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <div>
                  <h3>Targeted Impact</h3>
                  <p>Data-driven approach to identify and address community needs</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🤝</span>
                <div>
                  <h3>Collaborative Power</h3>
                  <p>Uniting volunteers, NGOs, and government bodies</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📈</span>
                <div>
                  <h3>Measurable Results</h3>
                  <p>Track and quantify your community impact</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mission-visual">
            <div className="image-grid">
              <Image 
                src={About} 
                alt="Community Impact" 
                className="main-image"
                fill 
                style={{objectFit: 'cover'}}
                priority
              />
              <div className="impact-counter">
                <span className="counter-number">150K+</span>
                <span className="counter-label">Lives Impacted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stats-wave"></div>
        <div className="stats-content">
          <h2 className="stats-title">Our Impact in Numbers</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-number" data-target="5000">5000+</div>
              <p>Active Volunteers</p>
              <div className="stat-growth">↑ 25% this year</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-number" data-target="1000">1000+</div>
              <p>Projects Completed</p>
              <div className="stat-growth">↑ 40% this year</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🤝</div>
              <div className="stat-number" data-target="200">200+</div>
              <p>NGO Partners</p>
              <div className="stat-growth">↑ 15% this year</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🌍</div>
              <div className="stat-number" data-target="50">50+</div>
              <p>Cities Covered</p>
              <div className="stat-growth">↑ 30% this year</div>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="process">
        <div className="mission-content">
          <div className="mission-text">
            <span className="section-badge">
              <span className="badge-icon">🎯</span>
              Process
            </span>
            <h2 className="section-title">How It Works</h2>
            <div className="mission-features">
              <div className="feature-item">
                <span className="feature-icon">👤</span>
                <div>
                  <h3>Create Profile</h3>
                  <p>Sign up and tell us about your interests and skills. We&apos;ll help you find the perfect opportunities.</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🤝</span>
                <div>
                  <h3>Get Matched</h3>
                  <p>Our AI matches you with projects that align with your skills and interests.</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⭐</span>
                <div>
                  <h3>Make Impact</h3>
                  <p>Start contributing to meaningful projects and track your impact in real-time.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mission-visual">
            <div className="process-visual">
              <svg className="process-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="var(--primary-light)" d="M47.7,-57.2C59.5,-47.3,65.5,-30.7,67.2,-14.1C68.9,2.5,66.3,19.1,58.5,32.8C50.7,46.5,37.7,57.3,22.7,62.7C7.7,68.1,-9.4,68.1,-25.6,63.1C-41.8,58.1,-57.1,48,-65.1,33.5C-73.1,19,-73.8,0.1,-68.8,-16.3C-63.8,-32.7,-53,-46.5,-39.7,-55.9C-26.3,-65.3,-10.4,-70.3,3.9,-75.1C18.2,-79.9,36.4,-84.5,47.7,-57.2Z" transform="translate(100 100)" />
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="var(--white)" fontSize="40">🚀</text>
              </svg>
              <div className="process-counter">
                <span className="counter-number">3 Steps</span>
                <span className="counter-label">Simple Process</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="projects">
        <div className="mission-content">
          <div className="mission-text">
            <span className="section-badge">
              <span className="badge-icon">💡</span>
              Featured Projects
            </span>
            <h2 className="section-title">Impact Stories</h2>
            <div className="mission-features">
              <div className="feature-item">
                <span className="feature-icon">📚</span>
                <div>
                  <h3>Education Revolution</h3>
                  <p>How digital literacy programs are transforming rural communities...</p>
                  <Link href="/blog/education" className="read-more">
                    Read More <span>→</span>
                  </Link>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌱</span>
                <div>
                  <h3>Green Initiative</h3>
                  <p>Community-led environmental projects making sustainable impact...</p>
                  <Link href="/blog/environment" className="read-more">
                    Read More <span>→</span>
                  </Link>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💪</span>
                <div>
                  <h3>Youth Leadership</h3>
                  <p>Young volunteers leading social change in urban neighborhoods...</p>
                  <Link href="/blog/youth" className="read-more">
                    Read More <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mission-visual">
            <div className="project-visual">
              <svg className="project-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="var(--primary-light)" d="M54.2,-64.5C69,-52.8,79.2,-35,83.6,-15.3C88,4.4,86.6,26,77.1,42.1C67.6,58.2,50,68.8,31.4,73.7C12.8,78.5,-6.7,77.5,-25.4,71.6C-44.1,65.7,-62,54.8,-71.5,38.5C-81,22.2,-82.1,0.4,-76.3,-17.8C-70.6,-36,-58,-50.6,-43.2,-62.3C-28.4,-74,-14.2,-82.8,2.6,-85.9C19.4,-89,39.4,-76.3,54.2,-64.5Z" transform="translate(100 100)" />
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="var(--white)" fontSize="40">💡</text>
              </svg>
              <div className="project-stats">
                <div className="stat-item">
                  <span className="stat-number">100+</span>
                  <span className="stat-label">Success Stories</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faqs" className="faq">
        <div className="mission-content">
          <div className="mission-text">
            <span className="section-badge">
              <span className="badge-icon">❓</span>
              Common Questions
            </span>
            <h2 className="section-title">Common Questions</h2>
            <FAQ />
          </div>
          <div className="mission-visual">
            <div className="faq-visual">
              <svg className="faq-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="var(--accent-light)" d="M54.2,-64.5C69,-52.8,79.2,-35,83.6,-15.3C88,4.4,86.6,26,77.1,42.1C67.6,58.2,50,68.8,31.4,73.7C12.8,78.5,-6.7,77.5,-25.4,71.6C-44.1,65.7,-62,54.8,-71.5,38.5C-81,22.2,-82.1,0.4,-76.3,-17.8C-70.6,-36,-58,-50.6,-43.2,-62.3C-28.4,-74,-14.2,-82.8,2.6,-85.9C19.4,-89,39.4,-76.3,54.2,-64.5Z" transform="translate(100 100)" />
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="var(--white)" fontSize="40">❓</text>
              </svg>
              <div className="faq-stats">
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-preview-section">
        <div className="section-content">
          <h2>Latest Impact Stories</h2>
          <p>Discover how volunteers are making a difference in communities worldwide</p>
          <Link href="/blogs" className="cta-button">
            Read Our Stories →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
