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
          <Link href="#process">Process</Link>
          <Link href="#projects">Projects</Link>
          <Link href="#blogs">Stories</Link>
          <Link href="#faqs">FAQs</Link>
          <Link href="#about">About</Link>
        </div>
        
        <div className="nav-buttons">
          <Link href="/auth/login" className="btn btn-outline">Login</Link>
          <Link href="/auth/login" className="btn btn-primary">Get Started</Link>
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