import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  MapPin,
  Sparkles,
  CalendarDays,
  PieChart,
  ShieldAlert,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 text-sm tracking-wide transition-all duration-200 py-1 ${
      isActive
        ? 'text-gold font-medium border-b-2 border-gold'
        : 'text-luxury-muted hover:text-luxury-text hover:border-b-2 hover:border-gold/40'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center bg-bg-card/80 group-hover:border-gold group-hover:shadow-gold-sm transition-all duration-300">
              <Compass className="w-5 h-5 text-gold group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-gold-gradient">
                GLOBETROTTER
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-luxury-muted -mt-1 group-hover:text-gold transition-colors">
                Explore Beyond Boundaries
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/explore" className={navLinkClass}>
              <MapPin className="w-4 h-4 text-gold/80" />
              Explore
            </NavLink>
            <NavLink to="/plan-trip" className={navLinkClass}>
              <Sparkles className="w-4 h-4 text-gold" />
              AI Planner
            </NavLink>
            <NavLink to="/my-trips" className={navLinkClass}>
              <CalendarDays className="w-4 h-4 text-gold/80" />
              My Trips
            </NavLink>
            <NavLink to="/budget" className={navLinkClass}>
              <PieChart className="w-4 h-4 text-gold/80" />
              Budget
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass}>
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Admin
              </NavLink>
            )}
          </nav>

          {/* User / Auth CTA Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 pr-2.5 rounded-full bg-bg-card border border-luxury-border hover:border-gold/50 transition-all focus:outline-none"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-gold/40"
                  />
                  <span className="text-sm font-medium text-luxury-text max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-luxury-muted" />
                </button>

                {/* Dropdown */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl glass-dropdown p-2 shadow-2xl z-50 animate-fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-luxury-border/50 mb-1">
                      <p className="text-xs text-luxury-muted">Signed in as</p>
                      <p className="text-sm font-semibold text-gold truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-luxury-text hover:text-gold hover:bg-bg-hover rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4 text-gold/80" />
                      Profile & Favorites
                    </Link>

                    <Link
                      to="/my-trips"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-luxury-text hover:text-gold hover:bg-bg-hover rounded-lg transition-colors"
                    >
                      <CalendarDays className="w-4 h-4 text-gold/80" />
                      Saved Journeys
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-amber-300 hover:bg-bg-hover rounded-lg transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-luxury-border/50 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-luxury-text hover:text-gold transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium px-4 py-2 rounded-full bg-gold-gradient text-bg-primary hover:opacity-90 font-semibold shadow-gold-sm transition-all transform hover:scale-[1.02]"
                >
                  Join Globetrotter
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-luxury-text hover:text-gold focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-dropdown border-t border-luxury-border/60 px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-luxury-text hover:bg-bg-hover hover:text-gold"
          >
            Home
          </NavLink>
          <NavLink
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-luxury-text hover:bg-bg-hover hover:text-gold"
          >
            Explore Destinations
          </NavLink>
          <NavLink
            to="/plan-trip"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gold hover:bg-bg-hover"
          >
            AI Trip Planner
          </NavLink>
          <NavLink
            to="/my-trips"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-luxury-text hover:bg-bg-hover hover:text-gold"
          >
            My Trips
          </NavLink>
          <NavLink
            to="/budget"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-luxury-text hover:bg-bg-hover hover:text-gold"
          >
            Budget Planner
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-amber-400 hover:bg-bg-hover"
            >
              Admin Dashboard
            </NavLink>
          )}

          <div className="pt-4 border-t border-luxury-border/60">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-luxury-text hover:bg-bg-hover hover:text-gold"
                >
                  <User className="w-5 h-5 text-gold" />
                  Profile ({user.name})
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-950/30"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg border border-luxury-border text-sm font-medium hover:border-gold text-luxury-text"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-gold-gradient text-bg-primary text-sm font-semibold shadow-gold-sm"
                >
                  Join Globetrotter
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
