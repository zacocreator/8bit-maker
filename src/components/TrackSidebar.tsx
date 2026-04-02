import React from 'react';

interface Track {
  id: string;
  name: string;
  sub: string;
  color: string;
  icon: string;
  notes: any;
}

interface TrackSidebarProps {
  tracks: Track[];
}

export const TrackSidebar: React.FC<TrackSidebarProps> = ({ tracks }) => {
  return (
    <aside className="fixed left-0 top-12 h-[calc(100%-3rem)] w-72 z-40 flex flex-col bg-[#05151d] border-r-2 border-[#021018] font-['Space_Grotesk'] uppercase text-xs font-bold shadow-xl">
      {/* Trainer Settings (Stitch line 117-127) */}
      <div className="p-4 border-b-2 border-[#021018] bg-[#0e1d26]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#283740] flex items-center justify-center pixel-border-embossed">
            <span className="material-symbols-outlined text-[#b1d43d]">account_circle</span>
          </div>
          <div>
            <h2 className="text-[#b1d43d] text-sm">TRAINER SETTINGS</h2>
            <p className="text-[#42493f] text-[10px]">MASTER VOLUME: 80%</p>
          </div>
        </div>
      </div>

      {/* Tracks List (Stitch line 128-192) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {tracks.map((track) => (
          <div 
            key={track.id}
            className="bg-[#12212a] p-3 pixel-border-embossed border-l-4"
            style={{ borderLeftColor: track.color }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ color: track.color }}>{track.icon}</span>
                <span className="" style={{ color: track.color }}>{track.name}</span>
              </div>
              <span className="text-[10px] px-1 opacity-70" style={{ backgroundColor: `${track.color}20`, color: track.color }}>
                {track.sub}
              </span>
            </div>

            {/* VU Meter / Waveform visualization (Stitch line 138-148) */}
            <div className="h-16 bg-[#021018] relative mb-3 overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-full flex items-end gap-[2px] p-1">
                 {[40, 60, 55, 75, 90, 65, 45, 30, 50, 70, 85, 40, 20, 60, 55, 40].map((h, i) => (
                   <div 
                     key={i}
                     className="w-1 transition-all duration-100" 
                     style={{ 
                       height: `${h}%`, 
                       backgroundColor: track.color,
                       opacity: h > 70 ? 1 : 0.4 
                     }}
                   ></div>
                 ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-1 bg-[#283740] text-on-surface hover:bg-surface-bright active:translate-y-px transition-all">MUTE</button>
              <button className="flex-1 py-1 bg-[#283740] text-on-surface hover:bg-surface-bright active:translate-y-px transition-all">SOLO</button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action (Stitch line 193-197) */}
      <div className="p-4 bg-[#0e1d26] border-t-2 border-[#021018]">
        <button className="w-full py-3 bg-[#b1d43d] text-[#05151d] font-black pixel-border-embossed hover:translate-x-[1px] active:translate-y-[1px] transition-all">
          NEW PROJECT
        </button>
      </div>
    </aside>
  );
};
