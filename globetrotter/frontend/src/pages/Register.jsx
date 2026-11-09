import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    const res = await register(name, email, password);
    setSubmitting(false);

    if (res.success) {
      navigate('/explore');
    }
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
            Join Globetrotter
          </h1>
          <p className="text-xs text-luxury-muted">
            Embark on AI-orchestrated luxury expeditions across seven continents.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/50 text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-luxury-muted mb-1.5 font-semibold">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gold absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Lord Alexander Sterling"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-secondary border border-luxury-border text-sm text-luxury-text placeholder-luxury-muted focus:outline-none focus:border-gold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-luxury-muted mb-1.5 font-semibold">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gold absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="alexander@globetrotter.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-secondary border border-luxury-border text-sm text-luxury-text placeholder-luxury-muted focus:outline-none focus:border-gold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-luxury-muted mb-1.5 font-semibold">
              Password (Min 6 Characters)
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

          <div>
            <label className="block text-xs uppercase tracking-wider text-luxury-muted mb-1.5 font-semibold">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gold absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-secondary border border-luxury-border text-sm text-luxury-text placeholder-luxury-muted focus:outline-none focus:border-gold"
                required
              />
            </div>
          </div>

          <div className="text-[11px] text-luxury-muted leading-relaxed">
            By creating an account, you agree to Globetrotter’s Private Travel Charter and Terms of Service.
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gold-gradient text-bg-primary text-xs font-bold uppercase tracking-wider shadow-gold-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>{submitting ? 'Creating Membership...' : 'Create Membership'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-luxury-border/50 text-xs text-luxury-muted">
          Already a member?{' '}
          <Link to="/login" className="text-gold font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
