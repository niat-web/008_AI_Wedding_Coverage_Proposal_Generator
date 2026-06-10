import React, { useState } from 'react';
import { Search, Calendar, MapPin, Tag, ChevronRight, Inbox } from 'lucide-react';

export default function HistoryView({ proposals, onSelectProposal }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter proposals based on query matching coupleNames, city, venue, or packageType
  const filteredProposals = proposals.filter((p) => {
    const term = searchTerm.toLowerCase();
    const names = (p.coupleNames || '').toLowerCase();
    const city = (p.city || '').toLowerCase();
    const venue = (p.venue || '').toLowerCase();
    const pkg = (p.packageType || '').toLowerCase();
    return (
      names.includes(term) ||
      city.includes(term) ||
      venue.includes(term) ||
      pkg.includes(term)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Search and Filters Header */}
      <div className="glass-card rounded-2xl p-6 border border-gold-400/15 space-y-4">
        <div>
          <h2 className="font-serif text-2xl text-gold-300 font-medium tracking-wide">
            Proposal Logs
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Search and view previously generated wedding photography proposals.
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg wedding-input pl-10 text-sm"
            placeholder="Search by couple names, city, venue, or package type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gold-400/60" />
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-gold-400/10 flex flex-col items-center justify-center">
            <Inbox className="w-12 h-12 text-gold-400/40 mb-3" />
            <h3 className="text-lg text-gray-300 font-medium mb-1">No proposals found</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              {searchTerm 
                ? 'Try adjusting your search keywords.' 
                : 'Generate and save your first proposal to view logs here.'}
            </p>
          </div>
        ) : (
          filteredProposals.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectProposal(item)}
              className="glass-card rounded-xl p-5 border border-gold-400/15 hover:border-gold-400/35 transition-all duration-300 group cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-lg hover:shadow-gold-400/5"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-lg font-medium text-white group-hover:text-gold-300 transition-colors">
                    {item.coupleNames || 'Unnamed Couple'}
                  </h3>
                  <span className={`text-3xs uppercase tracking-widest px-2 py-0.5 rounded-full font-bold border ${
                    item.packageType === 'Luxury'
                      ? 'bg-gold-400/10 border-gold-400 text-gold-300'
                      : item.packageType === 'Premium'
                      ? 'bg-purple-950/20 border-purple-500/35 text-purple-300'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                  }`}>
                    {item.packageType || 'Standard'}
                  </span>
                  <span className={`text-3xs uppercase tracking-widest px-2 py-0.5 rounded-full font-bold border ${
                    item.theme === 'light'
                      ? 'bg-amber-100/15 border-amber-600/40 text-amber-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                  }`}>
                    {item.theme === 'light' ? 'Ivory Light' : 'Premium Dark'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold-400/60" />
                    Event Date: {item.weddingDate || 'TBD'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold-400/60" />
                    {item.venue || 'No venue'}, {item.city || 'No city'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-gold-400/60" />
                    Events: {Array.isArray(item.events) ? item.events.join(', ') : 'Not specified'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto border-t border-zinc-800/80 md:border-t-0 pt-3 md:pt-0 gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-3xs text-gray-500 uppercase tracking-wider">Generated on</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{formatDate(item.createdAt)}</p>
                </div>
                <button className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold-400 hover:text-gold-300 transition-colors cursor-pointer group-hover:translate-x-1 duration-300">
                  Open Proposal
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
