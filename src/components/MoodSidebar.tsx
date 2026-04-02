import React from 'react';

interface MoodButtonProps {
  label: string;
  icon: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

const MoodButton: React.FC<MoodButtonProps> = ({ label, icon, color, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-16 h-16 btn-hardware flex flex-col items-center justify-center gap-1 ${isActive ? 'btn-salmon' : 'btn-secondary opacity-60'}`}
  >
    <div className={`w-8 h-8 rounded-full border-2 border-current flex items-center justify-center p-1`}>
      <span className="text-lg">{icon}</span>
    </div>
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

export const MoodSidebar: React.FC<{ activeMood: string, onMoodChange: (mood: string) => void }> = ({ activeMood, onMoodChange }) => {
  const moods = [
    { id: 'meadow', label: 'MEADOW', icon: '🌿', color: '#9DD496' },
    { id: 'battle', label: 'BATTLE', icon: '🔥', color: '#FFB5A0' },
    { id: 'town', label: 'TOWN', icon: '💧', color: '#78C8E0' },
    { id: 'cave', label: 'CAVE', icon: '⛰️', color: '#A890F0' },
  ];

  return (
    <div className="w-40 bg-[#0E1D26] p-4 flex flex-col items-center gap-4 emboss-2px">
      <span className="text-[10px] font-bold opacity-40">ENVIRONMENT</span>
      <div className="grid grid-cols-2 gap-2">
        {moods.map(mood => (
          <MoodButton 
            key={mood.id}
            {...mood}
            isActive={activeMood === mood.id}
            onClick={() => onMoodChange(mood.id)}
          />
        ))}
      </div>
      <div className="mt-auto opacity-20 text-[8px] font-bold">
        STITCH_MOOD_BANK
      </div>
    </div>
  );
};

export const TransportBar: React.FC<{ bpm: number, setBpm: (b: number) => void }> = ({ bpm, setBpm }) => (
  <div className="h-16 bg-[#0E1D26] emboss-2px flex items-center px-6 gap-8">
    <div className="flex items-center gap-4">
      <button className="w-16 h-8 btn-hardware btn-secondary text-[10px] font-bold">PLAY</button>
      <button className="w-16 h-8 btn-hardware btn-secondary text-[10px] font-bold">STOP</button>
    </div>
    
    <div className="flex-grow h-8 bg-[#021018] deboss-2px flex flex-col justify-center px-4 relative">
      <div className="absolute top-0 bottom-0 left-0 bg-[#FFB5A0] opacity-10" style={{ width: `${(bpm - 60) / 120 * 100}%` }}></div>
      <input 
        type="range" min="60" max="180" value={bpm}
        onChange={(e) => setBpm(parseInt(e.target.value))}
        className="w-full h-full opacity-0 absolute inset-0 cursor-pointer"
      />
      <div className="flex justify-between items-center text-[10px] font-bold pointer-events-none">
        <span>BPM: {bpm}</span>
        <div className="flex gap-1 h-1">
          {[...Array(16)].map((_, i) => <div key={i} className="w-2 h-full bg-[#283740]"></div>)}
        </div>
      </div>
    </div>

    <div className="flex flex-col text-[10px] font-bold text-[#d4e5f0] opacity-60">
      <span>TIME: 00:04:22</span>
      <span>STEP: 12 / 16</span>
    </div>
  </div>
);
