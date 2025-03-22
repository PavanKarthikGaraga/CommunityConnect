'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './nav.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link href="/" className="logo">
          CommunityConnect
        </Link>
        
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link href="/projects">Projects</Link>
          <Link href="/volunteers">Volunteers</Link>
          <Link href="/ngos">NGOs</Link>
          <Link href="/government">Government</Link>
          <Link href="/about">About</Link>
        </div>
        
        <div className="nav-buttons">
          <Link href="/login" className="btn btn-outline">Login</Link>
          <Link href="/signup" className="btn btn-primary">Sign Up</Link>
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