import React from 'react';

export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="relative w-24 h-24 mb-8">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gold-400/20 border-t-gold-400 animate-spin"></div>
        {/* Middle Ring */}
        <div className="absolute inset-2 rounded-full border-4 border-gold-400/10 border-b-gold-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        {/* Inner Core */}
        <div className="absolute inset-5 rounded-full bg-gold-400/10 flex items-center justify-center animate-pulse">
          <div className="w-4 h-4 rounded-full bg-gold-400"></div>
        </div>
      </div>
      <h3 className="font-serif text-2xl text-gold-300 mb-2 font-medium tracking-wide">
        Creating Personalized Wedding Proposal
      </h3>
      <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
        Our AI engine is crafting custom photographer introductions, event coverage schedules, and pre-wedding concepts...
      </p>
    </div>
  );
}
