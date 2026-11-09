import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Map as MapIcon,
  Grid as GridIcon,
  X,
  Compass,
  ArrowUpDown,
} from 'lucide-react';
import api from '../services/api';
import DestinationCard from '../components/DestinationCard';
import InteractiveMap from '../components/InteractiveMap';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = [
  'All',
  'Romantic Destinations',
  'Mountains',
  'Beaches',
  'Adventure',
  'Historical Places',
  'Temples',
  'Wildlife',
  'Cities',
];

const sortOptions = [
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Budget: Low to High', value: 'budget-asc' },
  { label: 'Budget: High to Low', value: 'budget-desc' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Newest Arrivals', value: 'newest' },
];

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [countries, setCountries] = useState([]);
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [sort, setSort] = useState('rating');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map' or 'both'
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Sync category or search query from URL params if changed externally
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory && urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    }
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null && urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  // Fetch destinations
  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedCountry && selectedCountry !== 'All') params.country = selectedCountry;
      if (minBudget) params.minBudget = minBudget;
      if (maxBudget) params.maxBudget = maxBudget;
      if (sort) params.sort = sort;

      const { data } = await api.get('/destinations', { params });
      if (data.success) {
        setDestinations(data.destinations);

        // Extract unique countries list
        const countryList = Array.from(
          new Set(data.destinations.map((d) => d.country).filter(Boolean))
        );
        setCountries(countryList);
      }
    } catch (err) {
      console.error('Failed to fetch destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [selectedCategory, selectedCountry, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDestinations();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedCountry('All');
    setMinBudget('');
    setMaxBudget('');
    setSort('rating');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-luxury-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold font-semibold mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Discover The Earth</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-luxury-text">
            Explore Destinations
          </h1>
          <p className="text-sm text-luxury-muted mt-1">
            Browse hand-curated global sanctuaries, volcanic archipelagos, alpine summits, and sacred cities.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-bg-card p-1 rounded-xl border border-luxury-border self-start md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-gold text-bg-primary shadow-sm'
                : 'text-luxury-muted hover:text-luxury-text'
            }`}
          >
            <GridIcon className="w-4 h-4" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'map'
                ? 'bg-gold text-bg-primary shadow-sm'
                : 'text-luxury-muted hover:text-luxury-text'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Map</span>
          </button>
          <button
            onClick={() => setViewMode('both')}
            className={`hidden sm:flex px-3 py-1.5 rounded-lg text-xs font-semibold items-center gap-1.5 transition-all ${
              viewMode === 'both'
                ? 'bg-gold text-bg-primary shadow-sm'
                : 'text-luxury-muted hover:text-luxury-text'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Split View</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-bg-card p-4 sm:p-5 rounded-2xl border border-luxury-border/80 shadow-xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 text-gold absolute left-3.5" />
            <input
              type="text"
              placeholder="Search by destination name, country, city or attractions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-secondary border border-luxury-border text-sm text-luxury-text placeholder-luxury-muted focus:outline-none focus:border-gold"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 text-luxury-muted hover:text-luxury-text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gold-gradient text-bg-primary text-xs font-bold uppercase tracking-wider shadow-gold-sm hover:opacity-95 transition-opacity"
          >
            Search
          </button>

          <button
            type="button"
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="px-4 py-2.5 rounded-xl bg-bg-secondary border border-luxury-border text-xs font-semibold text-luxury-text flex items-center justify-center gap-2 hover:border-gold"
          >
            <Filter className="w-4 h-4 text-gold" />
            <span>Filters</span>
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearchParams(cat === 'All' ? {} : { category: cat });
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gold text-bg-primary font-bold shadow-gold-sm'
                  : 'bg-bg-secondary border border-luxury-border text-luxury-muted hover:text-luxury-text hover:border-gold/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Collapsible Advanced Filter Drawer */}
        {filterDrawerOpen && (
          <div className="pt-4 border-t border-luxury-border/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in text-xs">
            {/* Country Selector */}
            <div>
              <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
              >
                <option value="All">All Countries</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Budget */}
            <div>
              <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                Min Budget ($ USD)
              </label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
              />
            </div>

            {/* Max Budget */}
            <div>
              <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                Max Budget ($ USD)
              </label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
              />
            </div>

            {/* Sort Dropdown */}
            <div>
              <label className="block uppercase tracking-wider text-luxury-muted mb-1 font-semibold">
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-bg-secondary border border-luxury-border text-luxury-text focus:outline-none focus:border-gold"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between pt-2">
              <span className="text-luxury-muted">
                Showing {destinations.length} destination{destinations.length !== 1 ? 's' : ''}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 rounded-lg border border-luxury-border text-luxury-muted hover:text-luxury-text"
                >
                  Reset All
                </button>
                <button
                  type="button"
                  onClick={fetchDestinations}
                  className="px-4 py-1.5 rounded-lg bg-gold text-bg-primary font-bold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Rendering: Grid / Map / Split */}
      {loading ? (
        <LoadingSpinner text="Consulting our global concierge..." />
      ) : destinations.length === 0 ? (
        <div className="p-12 text-center bg-bg-card rounded-2xl border border-luxury-border/60 space-y-4">
          <Compass className="w-12 h-12 text-gold/50 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-luxury-text">
            No Destinations Found
          </h3>
          <p className="text-xs text-luxury-muted max-w-md mx-auto">
            We couldn't find any destinations matching your criteria. Try adjusting your search keyword or clearing active filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2 rounded-lg bg-gold text-bg-primary text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div>
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((dest) => (
                <DestinationCard key={dest._id} destination={dest} />
              ))}
            </div>
          )}

          {viewMode === 'map' && (
            <div className="space-y-4">
              <InteractiveMap destinations={destinations} height="650px" />
              <p className="text-xs text-center text-luxury-muted">
                Click on any golden compass marker to view destination overview and explore further.
              </p>
            </div>
          )}

          {viewMode === 'both' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {destinations.map((dest) => (
                  <DestinationCard key={dest._id} destination={dest} />
                ))}
              </div>
              <div className="lg:col-span-5 sticky top-24 h-[650px]">
                <InteractiveMap destinations={destinations} height="100%" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Explore;
