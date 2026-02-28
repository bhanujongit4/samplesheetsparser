'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [permanent, setPermanent] = useState([]);
  const [nonPermanent, setNonPermanent] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portfolio'); 
      const data = await response.json();
      
      // Filter out any "header" rows that might have slipped into the data
      const cleanPerm = (data.permanent || []).filter(c => 
        c.country && !c.country.toLowerCase().includes('permanent')
      );
      const cleanNonPerm = (data.non_permanent || []).filter(c => 
        c.country && !c.country.toLowerCase().includes('permanent')
      );

      setPermanent(cleanPerm);
      setNonPermanent(cleanNonPerm);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeStatus = (status) => status?.trim().toUpperCase();

  const getStatusColor = (status) => {
    const s = normalizeStatus(status);
    if (s === 'VACANT') return 'bg-green-500/10 text-green-400 border-green-500/30';
    if (s === 'ON-HOLD' || s === 'ON HOLD') return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    if (s === 'ALLOTTED') return 'bg-red-500/10 text-red-400 border-red-500/30';
    return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  };

  const filterList = (list) => {
    return list.filter(c => {
      const matchesSearch = c.country.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'ALL' || normalizeStatus(c.status) === filter;
      return matchesSearch && matchesFilter;
    });
  };

  const CountryCard = ({ country }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:border-blue-500/40 transition-all">
      <span className="text-white text-lg font-medium">{country.country}</span>
      <span className={`px-4 py-1.5 rounded-lg text-xs font-bold border uppercase tracking-widest ${getStatusColor(country.status)}`}>
        {normalizeStatus(country.status)}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/10 via-black to-red-900/10 pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-white to-red-400 bg-clip-text text-transparent mb-2">UNSC</h1>
          <p className="text-gray-500 tracking-widest uppercase text-sm font-bold">Member State Allocation</p>
        </header>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-10">
          <input
            type="text"
            placeholder="Search Member States..."
            className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2">
            {['ALL', 'VACANT', 'ON HOLD', 'ALLOTTED'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f === 'ON HOLD' ? 'ON-HOLD' : f)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold tracking-tighter uppercase border transition-all ${
                  (filter === f || (filter === 'ON-HOLD' && f === 'ON HOLD')) ? 'bg-white text-black' : 'bg-white/5 text-gray-400 border-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 animate-pulse text-blue-400 font-bold tracking-widest">LOADING DATABASE...</div>
        ) : (
          <div className="space-y-12">
            {/* Permanent Category */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-blue-400 font-black tracking-widest uppercase text-sm">Permanent Members (P5)</h2>
                <div className="h-[1px] flex-1 bg-blue-500/20" />
              </div>
              <div className="grid gap-3">
                {filterList(permanent).map((c, i) => <CountryCard key={i} country={c} />)}
              </div>
            </section>

            {/* Non-Permanent Category */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-red-400 font-black tracking-widest uppercase text-sm">Non-Permanent Members</h2>
                <div className="h-[1px] flex-1 bg-red-500/20" />
              </div>
              <div className="grid gap-3">
                {filterList(nonPermanent).map((c, i) => <CountryCard key={i} country={c} />)}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
