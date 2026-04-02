import React from 'react';
import { audioEngine } from '../lib/audioEngine';

interface ControlPanelProps {
  onSave?: () => void;
  onExportMIDI?: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onSave, 
  onExportMIDI 
}) => {
  const [bitcrush, setBitcrush] = React.useState(8);
  const [filter, setFilter] = React.useState(10000);
  const [volume, setVolume] = React.useState(0.8);

  const handleBitcrush = (val: number) => {
    setBitcrush(val);
    audioEngine.setBitCrush(val);
  };

  const handleFilter = (val: number) => {
    setFilter(val);
    audioEngine.setFilterFrequency(val);
  };

  const handleVolume = (val: number) => {
    setVolume(val);
    audioEngine.setMasterVolume(val);
  };

  return (
    <section className="bg-surface-container p-4 pixel-border-embossed space-y-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
          MASTER EFFECTS & EXPORT
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bitcrush Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold">
            <span className="text-secondary">BIT CRUSH: {bitcrush}</span>
            <span className="text-outline">1-8 BIT</span>
          </div>
          <div className="h-4 bg-surface-container-lowest relative pixel-border-debossed cursor-pointer group">
            <input 
              type="range" min="1" max="8" step="1" value={bitcrush} 
              onChange={(e) => handleBitcrush(parseInt(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            <div 
              style={{ width: `${(bitcrush / 8) * 100}%` }}
              className="absolute top-0 left-0 h-full bg-secondary opacity-20"
            ></div>
            <div 
              style={{ left: `${(bitcrush / 8) * 100}%` }}
              className="absolute top-0 -translate-x-1/2 w-4 h-full bg-[#12212a] border-2 border-secondary pointer-events-none"
            ></div>
          </div>
        </div>

        {/* Filter Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold">
            <span className="text-tertiary">LOWPASS FILTER: {filter}Hz</span>
            <span className="text-outline">20Hz-20kHz</span>
          </div>
          <div className="h-4 bg-surface-container-lowest relative pixel-border-debossed cursor-pointer group">
            <input 
              type="range" min="20" max="20000" step="100" value={filter} 
              onChange={(e) => handleFilter(parseInt(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            <div 
              style={{ width: `${(filter / 20000) * 100}%` }}
              className="absolute top-0 left-0 h-full bg-tertiary opacity-20"
            ></div>
            <div 
              style={{ left: `${(filter / 20000) * 100}%` }}
              className="absolute top-0 -translate-x-1/2 w-4 h-full bg-[#12212a] border-2 border-tertiary pointer-events-none"
            ></div>
          </div>
        </div>

        {/* Master Volume Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold">
            <span className="text-primary font-bold">MASTER VOL: {Math.round(volume * 100)}%</span>
          </div>
          <div className="h-4 bg-surface-container-lowest relative pixel-border-debossed cursor-pointer group">
            <input 
              type="range" min="0" max="1" step="0.01" value={volume} 
              onChange={(e) => handleVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
            />
            <div 
              style={{ width: `${volume * 100}%` }}
              className="absolute top-0 left-0 h-full bg-primary opacity-20"
            ></div>
            <div 
              style={{ left: `${volume * 100}%` }}
              className="absolute top-0 -translate-x-1/2 w-4 h-full bg-[#12212a] border-2 border-primary pointer-events-none"
            ></div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-surface-container-highest">
        <button 
          onClick={onSave}
          className="flex-1 pixel-border-embossed bg-primary text-surface py-2 font-bold uppercase text-[10px] tracking-widest hover:brightness-110 active:translate-y-[2px] transition-all"
        >
          SAVE PATTERN
        </button>
        <button 
          onClick={onExportMIDI}
          className="flex-1 pixel-border-embossed bg-secondary text-surface py-2 font-bold uppercase text-[10px] tracking-widest hover:brightness-110 active:translate-y-[2px] transition-all"
        >
          EXPORT MIDI (.mid)
        </button>
      </div>
    </section>
  );
};
