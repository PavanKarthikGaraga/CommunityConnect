'use client';
import Link from 'next/link';
import './page.css';

export default function BlogsPage() {
  const blogPosts = [
    {
      category: "Education",
      icon: "📚",
      title: "Digital Literacy Revolution",
      author: {
        name: "Sarah Johnson",
        avatar: "SJ"
      },
      date: "March 15, 2024",
      excerpt: "How volunteers are transforming rural communities through digital education...",
      path: "digital-literacy",
      bgColor: "var(--primary-light)",
      featured: true
    },
    {
      category: "Environment",
      icon: "🌱",
      title: "Green Cities Initiative",
      author: {
        name: "Emily Davis",
        avatar: "ED"
      },
      date: "March 12, 2024",
      excerpt: "Community-led projects that are making our cities more sustainable and liveable...",
      path: "green-cities",
      bgColor: "var(--accent-light)",
      featured: true
    },
    {
      category: "Youth Leadership",
      icon: "💪",
      title: "Next Gen Change Makers",
      author: {
        name: "Michael Thompson",
        avatar: "MT"
      },
      date: "March 10, 2024",
      excerpt: "Young volunteers taking the lead in transforming their communities through innovative projects...",
      path: "youth-leaders",
      bgColor: "var(--primary)"
    },
    {
      category: "Healthcare",
      icon: "🏥",
      title: "Healthcare Access for All",
      author: {
        name: "Dr. Sarah Adams",
        avatar: "DA"
      },
      date: "March 8, 2024",
      excerpt: "Volunteer medical professionals bringing healthcare to underserved communities...",
      path: "healthcare-access",
      bgColor: "var(--secondary)"
    },
    {
      category: "Technology",
      icon: "💻",
      title: "Tech for Good",
      author: {
        name: "Robert Lee",
        avatar: "RL"
      },
      date: "March 5, 2024",
      excerpt: "How technology volunteers are solving community challenges through innovation...",
      path: "tech-good",
      bgColor: "var(--accent)"
    },
    {
      category: "Community",
      icon: "🤝",
      title: "Building Stronger Communities",
      author: {
        name: "Laura Martinez",
        avatar: "LM"
      },
      date: "March 1, 2024",
      excerpt: "Stories of communities coming together to create lasting positive change...",
      path: "community-building",
      bgColor: "var(--primary-dark)"
    }
  ];

  return (
    <main className="blogs-page">
      <div className="blogs-container">
        {/* Navigation */}
        <div className="nav-links">
          <Link href="/" className="back-link">
            ← Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="blogs-header">
          <h1>Impact Stories</h1>
          <p className="subtitle">Discover stories of change and inspiration from our community</p>
          <div className="filter-options">
            <button className="filter-btn active">All</button>
            <button className="filter-btn">Education</button>
            <button className="filter-btn">Environment</button>
            <button className="filter-btn">Technology</button>
          </div>
        </div>

        {/* Featured Posts - Horizontal Cards */}
        <div className="featured-posts">
          {blogPosts.slice(0, 2).map((post, index) => (
            <Link href={`/blogs/${post.path}`} key={index} className="featured-card">
              <div className="card-icon" style={{ background: post.bgColor }}>
                <span>{post.icon}</span>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <span className="post-category">{post.category}</span>
                  <span className="post-date">{post.date}</span>
                </div>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <div className="author-info">
                  <div className="author-avatar">{post.author.avatar}</div>
                  <span>{post.author.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Regular Posts Grid */}
        <div className="posts-grid">
          {blogPosts.slice(2).map((post, index) => (
            <Link href={`/blogs/${post.path}`} key={index} className="post-card">
              <div className="card-header">
                <div className="header-left">
                  <span className="post-icon" style={{ background: post.bgColor }}>{post.icon}</span>
                  <span className="post-category">{post.category}</span>
                </div>
                <span className="post-date">{post.date}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="author-info">
                <div className="author-avatar">{post.author.avatar}</div>
                <span>{post.author.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="blogs-footer">
        <div className="footer-content">
          <p>Want to share your story? <Link href="/contact">Contact us</Link></p>
          <div className="footer-links">
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
