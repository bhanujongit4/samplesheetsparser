'use client';

import { useEffect, useState } from 'react';

export default function OICDashboard() {
  const [members, setMembers] = useState([]);
  const [observers, setObservers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/unhrc');
        const data = await res.json();
        setMembers(data.members || []);
        setObservers(data.observers || []);
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const normalizeStatus = (s) => s?.trim().toUpperCase();

  const getStatusColor = (status) => {
    const s = normalizeStatus(status);
    if (s === 'VACANT') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (s === 'ON-HOLD' || s === 'ON HOLD') return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    if (s === 'ALLOTTED') return 'bg-red-500/10 text-red-400 border-red-500/30';
    return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  };

  const processList = (list) => {
    return list.filter(c => {
      const matchesSearch = c.country.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'ALL' || normalizeStatus(c.status) === filter;
      return matchesSearch && matchesFilter;
    });
  };

  const ListSection = ({ title, data, accentColor }) => (
    <section className="mb-12">
      <div className="flex items-center gap-4 mb-6">
        <h2 className={`text-${accentColor}-400 font-black tracking-widest uppercase text-sm`}>{title}</h2>
        <div className={`h-[1px] flex-1 bg-${accentColor}-500/20`} />
      </div>
      <div className="grid gap-3">
        {processList(data).map((c, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:border-emerald-500/40 transition-all">
            <span className="text-white text-lg font-medium">{c.country}</span>
            <span className={`px-4 py-1.5 rounded-lg text-xs font-bold border uppercase tracking-widest ${getStatusColor(c.status)}`}>
              {normalizeStatus(c.status)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-900/10 via-black to-blue-900/10 pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-black bg-gradient-to-r from-emerald-400 via-white to-emerald-600 bg-clip-text text-transparent mb-2 tracking-tighter">OIC</h1>
          <p className="text-gray-500 tracking-[0.3em] uppercase text-xs font-bold">Organization of Islamic Cooperation</p>
        </header>

        {/* Search & Filter UI */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-10">
          <input
            type="text"
            placeholder="Search Member or Observer States..."
            className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl mb-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {['ALL', 'VACANT', 'ON-HOLD', 'ALLOTTED'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase border transition-all ${
                  filter === f ? 'bg-white text-black' : 'bg-white/5 text-gray-400 border-white/10'
                }`}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 animate-pulse text-emerald-400 font-bold tracking-widest">QUERYING OIC DATABASE...</div>
        ) : (
          <>
            <ListSection title="Member States" data={members} accentColor="emerald" />
            <ListSection title="Observer States" data={observers} accentColor="blue" />
          </>
        )}
      </div>
    </div>
  );
}
