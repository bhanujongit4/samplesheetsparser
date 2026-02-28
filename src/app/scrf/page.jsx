'use client';

import { useEffect, useState } from 'react';

export default function SCRFDashboard() {
  const [categories, setCategories] = useState({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const catLabels = {
    nca: "National Cybersecurity Agency (NCA)",
    jcmd: "Joint Command for Maritime Defense (JCMD)",
    iscia: "Intell-Services & Counter-Interference (ISCIA)",
    pcsl: "Public Communication & Safety Liaison (PCSL)",
    srwe: "Strategic Resource & Waste Enforcement (SRWE)",
    isde: "Infrastructure & Space Defense Executive (ISDE)",
    rocm: "Regulatory Oversight & Compliance Management (ROCM)"
  };

  useEffect(() => {
    fetch('/api/scrf')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  const normalizeStatus = (s) => s?.trim().toUpperCase();

  const getStatusColor = (status) => {
    const s = normalizeStatus(status);
    if (s === 'VACANT') return 'bg-green-500/10 text-green-400 border-green-500/30';
    if (s === 'ON-HOLD' || s === 'ON HOLD') return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    if (s === 'ALLOTTED') return 'bg-red-500/10 text-red-400 border-red-500/30';
    return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  };

  const filterItems = (items) => {
    if (!items) return [];
    return items.filter(item => {
      const matchesSearch = item.portfolio.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'ALL' || normalizeStatus(item.status) === filter;
      return matchesSearch && matchesFilter;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-black to-black pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-b from-violet-400 to-white bg-clip-text text-transparent mb-2">SCRF</h1>
          <p className="text-gray-500 tracking-[0.4em] uppercase text-[10px] font-bold">Special Committee on Regulatory Framework</p>
        </header>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-12">
          <input
            type="text"
            placeholder="Search SCRF Portfolios..."
            className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl mb-4 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {['ALL', 'VACANT', 'ON-HOLD', 'ALLOTTED'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                  filter === f ? 'bg-violet-500 border-violet-500 text-white' : 'bg-white/5 text-gray-400 border-white/10'
                }`}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 animate-pulse text-violet-400 font-bold tracking-widest text-xs">DECRYPTING SCRF DATA...</div>
        ) : (
          <div className="space-y-16">
            {Object.entries(categories).map(([key, items]) => {
              const filtered = filterItems(items);
              if (filtered.length === 0 && search) return null;
              
              return (
                <section key={key}>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-violet-400 font-black tracking-widest uppercase text-xs whitespace-nowrap">{catLabels[key]}</h2>
                    <div className="h-[1px] flex-1 bg-violet-500/20" />
                    <span className="text-[10px] text-gray-600 font-bold">{filtered.length} UNITS</span>
                  </div>
                  <div className="grid gap-3">
                    {filtered.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group">
                        <span className="text-white text-lg font-medium group-hover:translate-x-1 transition-transform">{item.portfolio}</span>
                        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-bold border uppercase tracking-widest ${getStatusColor(item.status)}`}>
                          {normalizeStatus(item.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
