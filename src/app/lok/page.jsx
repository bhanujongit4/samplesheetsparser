'use client';

import { useEffect, useState } from 'react';

export default function LokSabhaDashboard() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, filter, data]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/loksabha');
      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = data;

    if (filter !== 'ALL') {
      filtered = filtered.filter(item => normalizeStatus(item.status) === filter);
    }

    if (search) {
      filtered = filtered.filter(item => 
        item.portfolio?.toLowerCase().includes(search.toLowerCase()) ||
        item.party?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const normalizeStatus = (s) => s?.trim().toUpperCase();

  const getStatusColor = (status) => {
    const s = normalizeStatus(status);
    if (s === 'VACANT') return 'bg-green-500/10 text-green-400 border-green-500/30';
    if (s === 'ON-HOLD' || s === 'ON HOLD') return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    if (s === 'ALLOTTED') return 'bg-red-500/10 text-red-400 border-red-500/30';
    return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Background decoration */}
      <div className="fixed inset-0 bg-gradient-to-br from-orange-900/10 via-black to-green-900/10 pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent mb-2 tracking-tight">
            LOK SABHA
          </h1>
          <p className="text-gray-500 tracking-[0.2em] uppercase text-xs font-bold">Portfolio Allocation Control</p>
        </header>

        {/* Search & Filter Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-10">
          <input
            type="text"
            placeholder="Search Portfolios or Parties..."
            className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl mb-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {['ALL', 'VACANT', 'ON-HOLD', 'ALLOTTED'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase border transition-all ${
                  filter === f ? 'bg-white text-black' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                }`}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent mb-4"></div>
            <p className="text-gray-400 font-bold tracking-widest text-sm">ACCESSING LOK SABHA RECORDS...</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredData.length > 0 ? (
              filteredData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-xl hover:border-orange-500/40 transition-all group">
                  <div className="flex flex-col">
                    <span className="text-white text-lg font-bold group-hover:text-orange-400 transition-colors">
                      {item.portfolio}
                    </span>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">
                      {item.party || 'No Party Assigned'}
                    </span>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-[10px] font-black border uppercase tracking-[0.15em] ${getStatusColor(item.status)}`}>
                    {normalizeStatus(item.status)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-gray-600 uppercase text-sm tracking-widest">
                No portfolios found matching your search.
              </div>
            )}
          </div>
        )}

        {/* Stats footer for quick overview */}
        {!loading && (
          <div className="mt-12 flex justify-center gap-6 text-[10px] font-bold text-gray-500 tracking-widest uppercase">
            <span>Total: {data.length}</span>
            <span className="text-green-500">Vacant: {data.filter(d => normalizeStatus(d.status) === 'VACANT').length}</span>
            <span className="text-red-500">Allotted: {data.filter(d => normalizeStatus(d.status) === 'ALLOTTED').length}</span>
          </div>
        )}
      </div>
    </div>
  );
}
