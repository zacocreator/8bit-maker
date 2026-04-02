import React from 'react';

interface MixerTrackProps {
  id: string;
  label: string;
  iconOffset: number; // 0, 1, or 2 based on the sprite sheet
  color: string;
  volume: number;
}

const MixerTrack: React.FC<MixerTrackProps> = ({ id, label, iconOffset, color, volume }) => {
  return (
    <div className="flex flex-col items-center gap-4 p-4 panel-raised" style={{ width: '120px' }}>
      <span className="text-[9px] font-pixel text-outline mb-2">{id}</span>
      
      {/* Sprite Icon from public/assets/track_icons.png */}
      <div 
        className="track-icon" 
        style={{ 
          backgroundImage: 'url(/assets/track_icons.png)',
          backgroundPosition: `${-iconOffset * 100}% center`,
          backgroundSize: '300% 100%' 
        }} 
      />

      <div className="h-48 flex flex-col justify-end bg-surface-lowest p-1 py-2 relative">
         <div className="absolute inset-0 dither-overlay" />
         <div 
           className="w-full bg-opacity-80 transition-all duration-300"
           style={{ height: `${volume}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
         />
      </div>

      <div className="flex flex-col gap-1 w-full">
         <div className="text-[10px] font-pixel text-center">{label}</div>
         <div className="h-1 bg-surface-low w-full" />
      </div>
    </div>
  );
};

export const MixerPanel: React.FC = () => {
  return (
    <div className="p-4 flex gap-4 panel-base" style={{ borderLeft: '2px solid var(--color-surface-low)', height: '100%' }}>
      <MixerTrack id="TRK_01" label="LEAD" iconOffset={0} color="var(--color-primary)" volume={80} />
      <MixerTrack id="TRK_02" label="BASS" iconOffset={1} color="var(--color-secondary)" volume={75} />
      <MixerTrack id="TRK_03" label="DRUM" iconOffset={2} color="var(--color-tertiary)" volume={90} />
      
      <div className="flex flex-col justify-end p-4">
         <div className="p-4 panel-well text-[10px] font-pixel text-outline text-center">
            MASTER_LEVEL
            <div className="mt-4 h-2 w-16 bg-primary shadow-lg" />
         </div>
      </div>
    </div>
  );
};
