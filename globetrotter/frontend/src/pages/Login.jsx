import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-bg-card p-8 rounded-3xl border border-luxury-border/80 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center bg-bg-secondary mx-auto mb-3 shadow-gold-sm">
            <Compass className="w-6 h-6 text-gold" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-luxury-text">
            Welcome Back
          </h1>
          <p className="text-xs text-luxury-muted">
            Sign in to access your curated itineraries, private vouchers, and expense ledgers.
          </p>
        </div>

        {/* Quick Demo Credentials Buttons */}
        <div className="p-3 bg-bg-secondary rounded-xl border border-luxury-border/60 space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-gold font-bold block text-center">
            Quick Testing Credentials
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('traveler@globetrotter.com', 'traveler123456')}
              className="py-1.5 px-2 rounded-lg bg-bg-card border border-luxury-border hover:border-gold text-[11px] text-luxury-text flex items-center justify-center gap-1 transition-colors"
            >
              <User className="w-3 h-3 text-gold" />
              <span>Demo Traveler</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@globetrotter.com', 'admin123456')}
              className="py-1.5 px-2 rounded-lg bg-bg-card border border-luxury-border hover:border-gold text-[11px] text-amber-300 flex items-center justify-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-luxury-muted mb-1.5 font-semibold">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gold absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="name@globetrotter.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-secondary border border-luxury-border text-sm text-luxury-text placeholder-luxury-muted focus:outline-none focus:border-gold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-luxury-muted mb-1.5 font-semibold">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gold absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-secondary border border-luxury-border text-sm text-luxury-text placeholder-luxury-muted focus:outline-none focus:border-gold"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gold-gradient text-bg-primary text-xs font-bold uppercase tracking-wider shadow-gold-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>{submitting ? 'Verifying...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-luxury-border/50 text-xs text-luxury-muted">
          New to Globetrotter?{' '}
          <Link to="/register" className="text-gold font-semibold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
