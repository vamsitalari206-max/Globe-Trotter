import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  DollarSign,
  Heart,
  Share2,
  Sparkles,
  Compass,
  ArrowLeft,
  Send,
  CheckCircle2,
  Star,
  Info,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import InteractiveMap from '../components/InteractiveMap';
import LoadingSpinner from '../components/LoadingSpinner';

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleFavorite, isFavorite, showToast } = useAuth();

  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchDestinationData = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/destinations/${id}`);
        if (data.success) {
          setDestination(data.destination);
          setReviews(data.reviews || []);
        }
      } catch (err) {
        showToast('Failed to load destination details.', 'error');
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to post a review.', 'warning');
      navigate('/login');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('Please enter your review comments.', 'warning');
      return;
    }

    setSubmittingReview(true);
    try {
      const { data } = await api.post('/reviews', {
        destinationId: id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });

      if (data.success) {
        setReviews([data.review, ...reviews]);
        setReviewComment('');
        setReviewTitle('');
        setReviewRating(5);
        showToast('Your review has been verified and posted!', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review.';
      showToast(msg, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: destination?.title,
        text: destination?.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'info');
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Retrieving destination dossier..." />;
  }

  if (!destination) return null;

  const favorited = isFavorite(destination._id);
  const images = destination.images && destination.images.length > 0
    ? destination.images
    : ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-luxury-muted hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-bg-card border border-luxury-border text-luxury-muted hover:text-gold transition-colors"
            title="Share destination"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleFavorite(destination._id)}
            className={`p-2.5 rounded-full bg-bg-card border transition-colors ${
              favorited
                ? 'border-red-500/50 text-red-500'
                : 'border-luxury-border text-luxury-muted hover:text-red-400'
            }`}
            title={favorited ? 'Favorited' : 'Add to Favorites'}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hero Title & Meta */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold/10 border border-gold/30 text-gold">
            {destination.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-luxury-muted font-medium">
            <MapPin className="w-3.5 h-3.5 text-gold" />
            {destination.city ? `${destination.city}, ` : ''}{destination.country}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-luxury-text leading-tight">
          {destination.title || destination.name}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-luxury-muted pt-1">
          <RatingStars rating={destination.rating} reviewsCount={destination.reviewsCount} size="md" />
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-gold" />
            <span>Est. Budget: <strong className="text-luxury-text">${destination.estimatedBudget?.min?.toLocaleString()} - ${destination.estimatedBudget?.max?.toLocaleString()} USD</strong></span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gold" />
            <span>Best Season: <strong className="text-luxury-text">{destination.bestTimeToVisit}</strong></span>
          </div>
        </div>
      </div>

      {/* Luxury Image Gallery Mosaic */}
      <div className="space-y-4">
        <div className="aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-bg-secondary border border-luxury-border/60 shadow-2xl relative">
          <img
            src={images[activeImageIndex]}
            alt={destination.title}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent pointer-events-none" />
        </div>

        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  activeImageIndex === idx ? 'border-gold shadow-gold-sm scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Overview & Details Left, Action Sidebar Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Editorial Content */}
        <div className="lg:col-span-8 space-y-10">
          {/* Overview */}
          <div className="bg-bg-card p-6 sm:p-8 rounded-2xl border border-luxury-border/80 space-y-4 shadow-xl">
            <h2 className="font-serif text-2xl font-bold text-luxury-text flex items-center gap-2">
              <Compass className="w-5 h-5 text-gold" />
              <span>Destination Overview</span>
            </h2>
            <p className="text-sm sm:text-base text-luxury-muted leading-relaxed font-normal whitespace-pre-line">
              {destination.description}
            </p>
          </div>

          {/* Tourist Attractions */}
          {destination.attractions && destination.attractions.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-luxury-text">
                Key Tourist Attractions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destination.attractions.map((att, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-bg-card border border-luxury-border hover:border-gold/40 transition-all space-y-1.5"
                  >
                    <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-wider">
                      <div className="w-2 h-2 rounded-full bg-gold" />
                      <span>Highlight {idx + 1}</span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-luxury-text">
                      {att.name}
                    </h3>
                    {att.description && (
                      <p className="text-xs text-luxury-muted leading-relaxed">
                        {att.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Map */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-luxury-text">
                Geographic Cartography
              </h2>
              <span className="text-xs text-gold">
                Coordinates: {destination.coordinates?.lat?.toFixed(4)}, {destination.coordinates?.lng?.toFixed(4)}
              </span>
            </div>
            <InteractiveMap
              singleDestination={destination}
              attractions={destination.attractions || []}
              height="400px"
            />
          </div>

          {/* Travel Tips */}
          {destination.travelTips && destination.travelTips.length > 0 && (
            <div className="bg-bg-secondary p-6 rounded-2xl border border-luxury-border space-y-4">
              <h2 className="font-serif text-xl font-bold text-luxury-text flex items-center gap-2">
                <Info className="w-5 h-5 text-gold" />
                <span>Curated Travel Tips & Etiquette</span>
              </h2>
              <ul className="space-y-2.5">
                {destination.travelTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-luxury-muted">
                    <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Verified Traveler Reviews */}
          <div className="space-y-8 pt-4 border-t border-luxury-border/60">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-luxury-text">
                Traveler Reviews & Experiences
              </h2>
              <span className="text-xs text-gold font-semibold">
                {reviews.length} Verified Review{reviews.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Submit Review Box */}
            <div className="bg-bg-card p-6 rounded-2xl border border-luxury-border space-y-4 shadow-xl">
              <h3 className="font-serif text-lg font-bold text-luxury-text">
                Leave a Sovereign Review
              </h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wider text-luxury-muted">
                    Your Rating:
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="text-gold focus:outline-none transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating ? 'fill-gold' : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Review headline (e.g., Unforgettable sunset sailing...)"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-bg-secondary border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <textarea
                    rows={3}
                    placeholder="Share your personal impressions, dining recommendations, and insider advice..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-bg-secondary border border-luxury-border text-sm text-luxury-text focus:outline-none focus:border-gold resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 rounded-xl bg-gold-gradient text-bg-primary text-xs font-bold uppercase tracking-wider shadow-gold-sm hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Posting...' : 'Submit Review'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-xs text-luxury-muted italic text-center py-6">
                Be the first to share an exclusive review of {destination.name}.
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-5 rounded-xl bg-bg-card border border-luxury-border/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={rev.user?.name || 'Traveler'}
                          className="w-9 h-9 rounded-full object-cover border border-gold/40"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-luxury-text">
                            {rev.user?.name || 'Globetrotter Traveler'}
                          </h4>
                          <span className="text-[10px] text-luxury-muted">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <RatingStars rating={rev.rating} />
                    </div>

                    {rev.title && (
                      <h4 className="font-serif font-semibold text-sm text-gold-light">
                        {rev.title}
                      </h4>
                    )}

                    <p className="text-xs text-luxury-muted leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Action Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 bg-bg-card p-6 rounded-2xl border border-gold/40 shadow-2xl space-y-6">
            <div className="border-b border-luxury-border/60 pb-4">
              <span className="text-xs uppercase tracking-widest text-gold font-semibold block mb-1">
                Expedition Blueprint
              </span>
              <h3 className="font-serif text-2xl font-bold text-luxury-text">
                Ready to Experience {destination.name}?
              </h3>
            </div>

            <div className="space-y-3 text-xs text-luxury-muted">
              <div className="flex justify-between py-1.5 border-b border-luxury-border/40">
                <span>Estimated Budget</span>
                <span className="font-bold text-gold">${destination.estimatedBudget?.min} - ${destination.estimatedBudget?.max}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-luxury-border/40">
                <span>Optimal Season</span>
                <span className="font-semibold text-luxury-text">{destination.bestTimeToVisit}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-luxury-border/40">
                <span>Category</span>
                <span className="font-semibold text-luxury-text">{destination.category}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-luxury-border/40">
                <span>Key Highlights</span>
                <span className="font-semibold text-luxury-text">{destination.attractions?.length || 0} Attractions</span>
              </div>
            </div>

            {/* Launch AI Planner CTA with Prepopulated Destination */}
            <Link
              to={`/plan-trip?destination=${encodeURIComponent(destination.name || destination.title)}`}
              className="w-full py-3.5 px-4 rounded-xl bg-gold-gradient text-bg-primary text-xs font-bold uppercase tracking-wider shadow-gold-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan This Trip with AI</span>
            </Link>

            <button
              onClick={() => toggleFavorite(destination._id)}
              className="w-full py-2.5 px-4 rounded-xl bg-bg-secondary border border-luxury-border hover:border-gold text-xs font-semibold text-luxury-text flex items-center justify-center gap-2 transition-colors"
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : 'text-gold'}`} />
              <span>{favorited ? 'Saved in Your Favorites' : 'Save to Favorites'}</span>
            </button>

            <div className="p-3 bg-bg-secondary rounded-xl border border-luxury-border/60 text-[11px] text-luxury-muted text-center leading-relaxed">
              * Globetrotter AI auto-configures luxury stays, private transfers, and daily pacing for {destination.name}.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
