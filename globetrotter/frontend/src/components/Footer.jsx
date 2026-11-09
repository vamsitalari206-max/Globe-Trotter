import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, ArrowRight, Instagram, Twitter, Facebook, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useAuth();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please provide a valid email address.', 'warning');
      return;
    }
    setSubscribed(true);
    showToast('Thank you for subscribing to Globetrotter Curated Dispatches!', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-bg-secondary border-t border-luxury-border/60 text-luxury-muted">
      {/* Top Banner / Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-luxury-border/40">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center bg-bg-card">
                <Compass className="w-5 h-5 text-gold" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-widest text-gold-gradient">
                GLOBETROTTER
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-luxury-muted">
              Explore beyond boundaries. The premier AI-orchestrated luxury travel
              planner engineered for modern explorers seeking bespoke itineraries and unforgettable adventures.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-bg-card flex items-center justify-center hover:text-gold border border-luxury-border/60 hover:border-gold transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-bg-card flex items-center justify-center hover:text-gold border border-luxury-border/60 hover:border-gold transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-bg-card flex items-center justify-center hover:text-gold border border-luxury-border/60 hover:border-gold transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-bg-card flex items-center justify-center hover:text-gold border border-luxury-border/60 hover:border-gold transition-all">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-gold">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-gold transition-colors">Home Experience</Link></li>
              <li><Link to="/explore" className="hover:text-gold transition-colors">Curated Destinations</Link></li>
              <li><Link to="/plan-trip" className="hover:text-gold transition-colors">AI Trip Planner</Link></li>
              <li><Link to="/my-trips" className="hover:text-gold transition-colors">Saved Itineraries</Link></li>
              <li><Link to="/budget" className="hover:text-gold transition-colors">Smart Expense Ledger</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-gold">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explore?category=Romantic Destinations" className="hover:text-gold transition-colors">Romantic Getaways</Link></li>
              <li><Link to="/explore?category=Mountains" className="hover:text-gold transition-colors">Alpine Escapes</Link></li>
              <li><Link to="/explore?category=Historical Places" className="hover:text-gold transition-colors">Historic Wonders</Link></li>
              <li><Link to="/explore?category=Beaches" className="hover:text-gold transition-colors">Coastal Retreats</Link></li>
              <li><Link to="/explore?category=Adventure" className="hover:text-gold transition-colors">Expedition & Thrill</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-gold">Private Dispatches</h4>
            <p className="text-xs text-luxury-muted">
              Subscribe to receive confidential invitations, private villa alerts, and seasonal voyage curation.
            </p>
            {subscribed ? (
              <div className="p-3 bg-bg-card border border-gold/30 rounded-lg text-xs text-gold">
                ✓ You are enrolled in Globetrotter Dispatches.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2.5 rounded-lg bg-bg-card border border-luxury-border text-xs text-luxury-text focus:outline-none focus:border-gold transition-colors pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1 rounded-md bg-gold text-bg-primary hover:bg-gold-hover transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-500">Zero spam. Unsubscribe at any time.</p>
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} GLOBETROTTER. All rights reserved. Crafted for world travelers.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gold transition-colors">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
