'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './nav.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      // Show navbar after scrolling past half of hero section
      setScrolled(window.scrollY > heroHeight / 2);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render navbar at all if not scrolled
  if (!scrolled) return null;

  return (
    <nav className="navbar floating-nav">
      <div className="nav-container">
        <Link href="/" className="logo">
          CommunityConnect
        </Link>
        
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link href="/blogs">Blogs</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/ngos">NGOs</Link>
          {/* <Link href="/impact">Impact</Link> */}
          {/* <Link href="/about">About</Link> */}
        </div>
        
        <div className="nav-buttons">
          <Link href="/login" className="btn btn-outline">Login</Link>
          <Link href="/get-started" className="btn btn-primary">Get Started</Link>
        </div>
        
        <button 
          className={`menu-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
} 