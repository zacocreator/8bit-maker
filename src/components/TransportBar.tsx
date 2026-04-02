import React from 'react';
import { Play, Square, Settings } from 'lucide-react';

interface TransportBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  bpm: number;
  currentTime: number;
}

export const TransportBar: React.FC<TransportBarProps> = ({ 
  isPlaying, 
  onTogglePlay, 
  bpm, 
  currentTime 
}) => {
  return (
    <footer className="h-16 flex items-center justify-between px-6 bg-surface-lowest shadow-2xl relative z-100">
      <div className="absolute inset-0 dither-bg opacity-10 pointer-events-none" />
      
      {/* 1. Playback Controls */}
      <div className="flex gap-2">
        <button 
          onClick={onTogglePlay}
          className={`pixel-button-tactile ${isPlaying ? 'bg-tertiary text-surface-lowest' : 'bg-primary text-surface-lowest'}`}
          style={{ width: '120px', height: '40px' }}
        >
          {isPlaying ? (
            <div className="flex items-center justify-center gap-2">
              <Square size={16} fill="currentColor" /> ABORT
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Play size={16} fill="currentColor" /> PREVIEW
            </div>
          )}
        </button>
      </div>

      {/* 2. Central Instrument Area: BPM Slider */}
      <div className="flex items-center gap-6 module-panel px-6 py-2">
        <label className="text-[10px] font-pixel text-outline uppercase">BPM_INSTRUMENT</label>
        <div className="well w-48 h-6 relative overflow-hidden flex items-center px-1">
           <div 
             className="h-4 bg-primary transition-all duration-300" 
             style={{ width: `${(bpm / 240) * 100}%`, backgroundColor: 'var(--color-primary)' }}
           />
           <div className="absolute left-0 right-0 flex justify-between px-2 text-[9px] font-bold text-surface-lowest pointer-events-none">
             <span>LOW</span>
             <span>HI</span>
           </div>
        </div>
        <div className="text-xl font-display font-bold text-primary glow-active w-12 text-center">
          {bpm}
        </div>
      </div>

      {/* 3. Timecode Displays */}
      <div className="flex gap-4">
        {[
           { label: 'TIME_SEC', value: currentTime.toFixed(2) },
           { label: 'MEASURE', value: `${Math.floor(currentTime / (240 / bpm)) + 1} / 16` }
        ].map(item => (
          <div key={item.label} className="p-2 well flex flex-col items-end min-w-[80px]">
             <span className="text-[8px] font-pixel text-outline-variant">{item.label}</span>
             <span className="text-sm font-display text-primary">{item.value}</span>
          </div>
        ))}
        <button className="pixel-button-tactile p-2 h-full flex items-center justify-center">
           <Settings size={16} />
        </button>
      </div>
    </footer>
  );
};
