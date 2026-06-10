import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, Gift, Clock, Award, FileText } from 'lucide-react';

const EVENT_OPTIONS = ['Mehendi', 'Sangeet', 'Wedding Ceremony', 'Reception'];
const PACKAGE_OPTIONS = ['Classic', 'Premium', 'Luxury'];
const SPECIAL_REQUEST_SUGGESTIONS = [
  'Drone coverage',
  'Candid photography',
  'Cinematic film',
  'Traditional photography',
  'Same-day edit video',
  'Luxury leather album'
];

export default function Form({ onSubmit, isLoading }) {
  const [coupleNames, setCoupleNames] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [packageType, setPackageType] = useState('Premium');
  const [specialRequests, setSpecialRequests] = useState('');
  const [theme, setTheme] = useState('dark');
  const [errors, setErrors] = useState({});

  const handleEventChange = (event) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter(e => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const handleAddSuggestion = (suggestion) => {
    if (specialRequests.includes(suggestion)) return;
    setSpecialRequests(prev => prev ? `${prev}, ${suggestion}` : suggestion);
  };

  const validate = () => {
    const newErrors = {};
    if (!coupleNames.trim()) {
      newErrors.coupleNames = 'Couple Names are required';
    }
    if (!weddingDate) {
      newErrors.weddingDate = 'Wedding Date is required';
    }
    if (!venue.trim()) {
      newErrors.venue = 'Venue (Place) is required';
    }
    if (!city.trim()) {
      newErrors.city = 'City is required';
    }
    if (selectedEvents.length === 0) {
      newErrors.events = 'At least one event (feature) must be selected';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    onSubmit({
      coupleNames: coupleNames.trim(),
      weddingDate,
      venue: venue.trim(),
      city: city.trim(),
      events: selectedEvents,
      packageType: packageType || 'Premium',
      specialRequests,
      theme
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 space-y-6 max-w-3xl mx-auto border border-gold-400/20">
      <div className="border-b border-gold-400/15 pb-4 mb-6">
        <h2 className="font-serif text-2xl md:text-3xl text-gold-300 font-medium tracking-wide flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-gold-400" />
          Create New Proposal
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Fill in the couple's wedding details below to generate a tailored photography proposal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Couple Names */}
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gold-300/80 flex items-center gap-1.5">
            Couple Names <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              className={`w-full px-4 py-3 rounded-lg wedding-input pl-10 text-sm ${errors.coupleNames ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
              placeholder="e.g. Sarah & Michael"
              value={coupleNames}
              onChange={(e) => setCoupleNames(e.target.value)}
            />
            <Award className="absolute left-3.5 top-3.5 w-4 h-4 text-gold-400/60" />
          </div>
          {errors.coupleNames && <p className="text-xs text-red-400 mt-1">{errors.coupleNames}</p>}
        </div>

        {/* Wedding Date */}
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gold-300/80 flex items-center gap-1.5">
            Wedding Date <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              className={`w-full px-4 py-3 rounded-lg wedding-input pl-10 text-sm ${errors.weddingDate ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
            />
            <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-gold-400/60" />
          </div>
          {errors.weddingDate && <p className="text-xs text-red-400 mt-1">{errors.weddingDate}</p>}
        </div>

        {/* Venue */}
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gold-300/80 flex items-center gap-1.5">
            Venue (Place) <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              className={`w-full px-4 py-3 rounded-lg wedding-input pl-10 text-sm ${errors.venue ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
              placeholder="e.g. Taj Mahal Palace Hotel"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
            <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gold-400/60" />
          </div>
          {errors.venue && <p className="text-xs text-red-400 mt-1">{errors.venue}</p>}
        </div>

        {/* City */}
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gold-300/80 flex items-center gap-1.5">
            City <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              className={`w-full px-4 py-3 rounded-lg wedding-input pl-10 text-sm ${errors.city ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
              placeholder="e.g. Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gold-400/60" />
          </div>
          {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city}</p>}
        </div>
      </div>

      {/* Events Covered */}
      <div className="flex flex-col space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-gold-300/80 flex items-center gap-1.5">
          Events Covered <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {EVENT_OPTIONS.map((event) => {
            const isChecked = selectedEvents.includes(event);
            return (
              <label
                key={event}
                className={`flex items-center justify-between p-3.5 rounded-lg border text-sm cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-gold-400/10 border-gold-400 text-gold-100'
                    : 'bg-zinc-900/40 border-zinc-800 text-gray-400 hover:border-gold-400/35'
                } ${errors.events ? 'border-red-400' : ''}`}
              >
                <span>{event}</span>
                <input
                  type="checkbox"
                  className="accent-gold-400 rounded cursor-pointer"
                  checked={isChecked}
                  onChange={() => handleEventChange(event)}
                />
              </label>
            );
          })}
        </div>
        {errors.events && <p className="text-xs text-red-400 mt-1">{errors.events}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Package Type */}
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gold-300/80 flex items-center gap-1.5">
            Package Type
          </label>
          <div className="relative">
            <select
              className="w-full px-4 py-3 rounded-lg wedding-input pl-10 text-sm appearance-none cursor-pointer"
              value={packageType}
              onChange={(e) => setPackageType(e.target.value)}
            >
              {PACKAGE_OPTIONS.map(opt => (
                <option key={opt} value={opt} className="bg-zinc-950 text-gray-200">
                  {opt} Package
                </option>
              ))}
            </select>
            <Gift className="absolute left-3.5 top-3.5 w-4 h-4 text-gold-400/60" />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gold-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Proposal Theme */}
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gold-300/80 flex items-center gap-1.5">
            Proposal Theme
          </label>
          <div className="relative">
            <select
              className="w-full px-4 py-3 rounded-lg wedding-input pl-10 text-sm appearance-none cursor-pointer"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="dark" className="bg-zinc-950 text-gray-200">Premium Dark</option>
              <option value="light" className="bg-zinc-950 text-gray-200">Ivory Light</option>
            </select>
            <Sparkles className="absolute left-3.5 top-3.5 w-4 h-4 text-gold-400/60" />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gold-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <div className="flex flex-col space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-gold-300/80 flex items-center gap-1.5">
          Special Requests <span className="text-gray-400 text-2xs lowercase font-normal">(Optional)</span>
        </label>
        <div className="relative">
          <textarea
            className="w-full px-4 py-3 rounded-lg wedding-input pl-10 text-sm min-h-[100px] resize-y"
            placeholder="Specify any drone desires, cinematic preferences, canvas setups, etc."
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
          />
          <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-gold-400/60" />
        </div>
        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2 mt-2">
          {SPECIAL_REQUEST_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleAddSuggestion(suggestion)}
              className="text-xs bg-zinc-900 border border-zinc-800 text-gray-300 px-3 py-1.5 rounded-full hover:border-gold-400 hover:text-gold-300 transition-colors"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-lg bg-gradient-to-r from-gold-600 to-gold-400 text-zinc-950 font-semibold uppercase tracking-widest text-sm hover:from-gold-500 hover:to-gold-300 hover:shadow-lg hover:shadow-gold-400/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {isLoading ? (
            <>
              <Clock className="w-5 h-5 animate-spin" />
              Generating Proposal...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Proposal
            </>
          )}
        </button>
      </div>
    </form>
  );
}
