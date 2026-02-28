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
      // Ensure this matches your API route path
      const response = await fetch('/api/unsc'); 
      const data = await response.json();
      
      // Since the API returns { permanent: [], non_permanent: [] }
      // We combine them into a single list for the dashboard
      const allMembers = [...(data.permanent || []), ...(data.non_permanent || [])];
      setCountries(allMembers);
    } catch (error) {
      console.error('Error fetching UNSC data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = countries;

    if (filter !== 'ALL') {
      filtered = filtered.filter((c) => c.status?.toUpperCase() === filter.toUpperCase());
    }

    if (search) {
      filtered = filtered.filter((c) =>
        c.country.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredCountries(filtered);
  };

  // Helper to normalize status for comparison
  const normalizeStatus = (status) => status?.trim().toUpperCase();

  const getStatusLabel = (status) => {
    const s = normalizeStatus(status);
    if (s === 'VACANT') return 'VACANT';
    if (s === 'ALLOTTED') return 'ALLOTTED';
    if (s === 'ON-HOLD' || s === 'ON HOLD') return 'ON HOLD';
    return status;
  };

  const getStatusColor = (status) => {
    const s = normalizeStatus(status);
    switch (s) {
      case 'VACANT':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'ON-HOLD':
      case 'ON HOLD':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'ALLOTTED':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getCount = (status) => {
    if (status === 'ALL') return countries.length;
    return countries.filter((c) => normalizeStatus(c.status) === normalizeStatus(status)).length;
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-950/20 via-black to-red-950/20 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-blue-500 via-white to-red-500 bg-clip-text text-transparent tracking-tight">
            UNSC
          </h1>
          <p className="text-gray-400 text-base sm:text-xl font-light tracking-wide px-4">
            Security Council Member Allocation
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{getCount('ALL')}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Total</div>
          </div>
          <div className="bg-green-500/5 backdrop-blur-sm border border-green-500/20 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1">{getCount('VACANT')}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Vacant</div>
          </div>
          <div className="bg-yellow-500/5 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-1">{getCount('ON-HOLD')}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">On Hold</div>
          </div>
          <div className="bg-red-500/5 backdrop-blur-sm border border-red-500/20 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-red-400 mb-1">{getCount('ALLOTTED')}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Allotted</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="mb-4 sm:mb-5">
            <input
              type="text"
              placeholder="Search Security Council members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg"
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {['ALL', 'VACANT', 'ON-HOLD', 'ALLOTTED'].map((stat) => (
              <button
                key={stat}
                onClick={() => setFilter(stat)}
                className={`px-4 py-2.5 rounded-lg font-semibold transition-all text-xs uppercase tracking-wider border ${
                  filter === stat
                    ? 'bg-white text-black border-white'
                    : 'bg-white/10 text-gray-400 border-white/10 hover:bg-white/20'
                }`}
              >
                {stat.replace('-', ' ')} <span className="ml-1 opacity-70">({getCount(stat)})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Countries List */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent mb-4"></div>
              <p className="text-gray-400">Synchronizing with UN Database...</p>
            </div>
          ) : filteredCountries.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No member states found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCountries.map((country, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:border-blue-500/50 transition-all group"
                >
                  <div className="flex flex-col">
                    <span className="text-white text-lg font-semibold tracking-wide">
                      {country.country}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                      {country.type} MEMBER
                    </span>
                  </div>
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

        {/* Refresh */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchCountries}
            disabled={loading}
            className="px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-sm"
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
