'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, search, countries]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = countries;

    if (filter !== 'ALL') {
      filtered = filtered.filter((c) => c.status === filter);
    }

    if (search) {
      filtered = filtered.filter((c) =>
        c.country.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredCountries(filtered);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'U':
        return 'UNALLOTTED';
      case 'H':
        return 'ON HOLD';
      case 'A':
        return 'ALLOTTED';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'U':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'H':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'A':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getCount = (status) => {
    if (status === 'ALL') return countries.length;
    return countries.filter((c) => c.status === status).length;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-red-950/20 via-black to-red-950/20 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-red-500 via-white to-red-500 bg-clip-text text-transparent tracking-tight">
           NSUTMUN ECOSOC 2024
          </h1>
          <p className="text-gray-400 text-xl font-light tracking-wide">
            Portfolio Matrix
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">{getCount('ALL')}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Total</div>
          </div>
          <div className="bg-green-500/5 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">{getCount('U')}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Free</div>
          </div>
          <div className="bg-yellow-500/5 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-1">{getCount('H')}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Hold</div>
          </div>
          <div className="bg-red-500/5 backdrop-blur-sm border border-red-500/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-red-400 mb-1">{getCount('A')}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Taken</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-6">
          {/* Search Bar */}
          <div className="mb-5">
            <input
              type="text"
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-4 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all text-sm uppercase tracking-wider ${
                filter === 'ALL'
                  ? 'bg-white text-black shadow-lg shadow-white/20'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20 border border-white/10'
              }`}
            >
              All <span className="ml-2 text-xs opacity-70">({getCount('ALL')})</span>
            </button>
            <button
              onClick={() => setFilter('U')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all text-sm uppercase tracking-wider ${
                filter === 'U'
                  ? 'bg-green-500 text-black shadow-lg shadow-green-500/30'
                  : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30'
              }`}
            >
              Unallotted <span className="ml-2 text-xs opacity-70">({getCount('U')})</span>
            </button>
            <button
              onClick={() => setFilter('H')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all text-sm uppercase tracking-wider ${
                filter === 'H'
                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30'
                  : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/30'
              }`}
            >
              On Hold <span className="ml-2 text-xs opacity-70">({getCount('H')})</span>
            </button>
            <button
              onClick={() => setFilter('A')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all text-sm uppercase tracking-wider ${
                filter === 'A'
                  ? 'bg-red-500 text-black shadow-lg shadow-red-500/30'
                  : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30'
              }`}
            >
              Allotted <span className="ml-2 text-xs opacity-70">({getCount('A')})</span>
            </button>
          </div>
        </div>

        {/* Countries List */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent mb-4"></div>
              <p className="text-gray-400 text-lg">Loading countries...</p>
            </div>
          ) : filteredCountries.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No countries found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCountries.map((country, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all group"
                >
                  <span className="text-white text-lg font-semibold tracking-wide">
                    {country.country}
                  </span>
                  <span
                    className={`px-4 py-2 rounded-lg text-xs font-bold border uppercase tracking-widest ${getStatusColor(
                      country.status
                    )}`}
                  >
                    {getStatusLabel(country.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchCountries}
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-bold hover:from-red-500 hover:to-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-500/30 text-lg uppercase tracking-wider"
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
