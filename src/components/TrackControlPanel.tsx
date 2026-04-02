import React from 'react';

interface TrackControlProps {
  id: string;
  label: string;
  iconOffset: number;
  color: string;
  volume: number;
}

const VUMeter: React.FC<{ level: number }> = ({ level }) => {
  return (
    <div className="flex flex-col-reverse h-32 w-3 gap-[1px]">
      {[...Array(12)].map((_, i) => {
        const isActive = (i / 11) * 100 <= level;
        const isPeak = i > 9;
        return (
          <div 
            key={i} 
            className={`w-full h-2 ${isActive ? (isPeak ? 'vu-meter-peak' : 'vu-meter-active') : 'bg-[#021018]'}`} 
          />
        );
      })}
    </div>
  );
};

export const TrackControlPanel: React.FC<TrackControlProps> = ({ id, label, iconOffset, color, volume }) => {
  return (
    <div className="flex flex-col gap-2 p-3 module-panel w-[100px] items-center">
      <span className="text-[9px] font-pixel text-outline uppercase">{id}</span>
      
      {/* Sprite Icon Section */}
      <div className="well p-1">
        <div 
          className="w-16 h-16" 
          style={{ 
            backgroundImage: 'url(/assets/track_icons.png)',
            backgroundPosition: `${-iconOffset * 100}% center`,
            backgroundSize: '300% 100%' 
          }} 
        />
      </div>

      <div className="text-[10px] font-bold font-display text-primary truncate w-full text-center tracking-tighter">
        {label}
      </div>

      {/* Metering & Fader Section */}
      <div className="flex gap-2 items-end mt-2">
        <VUMeter level={volume} />
        <div className="h-32 w-4 well relative overflow-hidden flex items-end">
           <div 
             className="w-full transition-all duration-200" 
             style={{ height: `${volume}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
           />
        </div>
      </div>

      {/* Tactile Buttons */}
      <div className="grid grid-cols-2 gap-1 w-full mt-2">
         <button className="pixel-button-tactile text-[8px] p-1 h-6">M</button>
         <button className="pixel-button-tactile text-[8px] p-1 h-6">S</button>
      </div>
    </div>
  );
};
