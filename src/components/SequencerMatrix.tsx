import React from 'react';

interface Track {
  id: string;
  name: string;
  color: string;
  notes: Record<number, number[]>;
}

interface SequencerMatrixProps {
  tracks: Track[];
  currentStep: number;
  onToggleNote: (trackIdx: number, step: number, pitch: number) => void;
}

export const SequencerMatrix: React.FC<SequencerMatrixProps> = ({ 
  tracks, 
  currentStep, 
  onToggleNote 
}) => {
  const getSubSteps = (trackId: string) => {
    if (trackId === 'lead') return [72, 67, 60];
    if (trackId === 'bass') return [48, 36];
    return [36];
  };

  return (
    <section className="bg-[#021018] p-4 pixel-border-debossed space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest leading-none">
            MULTI-TRACK STEP SEQUENCER (64 STEPS / 4 BARS)
          </span>
          <span className="text-[8px] text-[#b1d43d60] uppercase mt-1">SCROLL HORIZONTALLY TO VIEW ALL BARS</span>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 bg-[#b1d43d] animate-pulse"></div>
          <span className="text-[8px] text-[#b1d43d] uppercase font-bold">SIGNAL ACTIVE</span>
        </div>
      </div>

      <div className="space-y-4">
        {tracks.map((track, trackIdx) => {
          const subSteps = getSubSteps(track.id);
          return (
            <div key={track.id} className="flex gap-4">
              {/* Lane Info */}
              <div className="w-32 flex flex-col justify-center border-r-2 border-[#12212a] pr-4 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: track.color }}>
                  {track.name}
                </span>
                <div className="flex gap-1 items-center mt-1">
                   <div className={`w-1.5 h-1.5 rounded-full ${track.notes[currentStep] ? 'animate-ping' : ''}`} style={{ backgroundColor: track.color }}></div>
                   <span className="text-[8px] text-outline-variant uppercase leading-none">
                    {track.id === 'lead' ? 'MAIN OSC' : track.id === 'bass' ? 'SUB OSC' : 'NOISE GEN'}
                  </span>
                </div>
              </div>

              {/* 64-Column Scrollable Grid */}
              <div className="flex-1 overflow-x-auto custom-scrollbar bg-[#05151e] pixel-border-debossed relative">
                <div className="grid grid-cols-64 gap-1 h-32 w-[1600px] relative p-1" style={{ gridTemplateColumns: 'repeat(64, minmax(0, 1fr))' }}>
                  {Array.from({ length: 64 }).map((_, step) => (
                    <div 
                      key={step} 
                      className={`flex flex-col gap-1 transition-all duration-75 ${step === currentStep ? 'bg-[#ffffff10] z-10' : ''} ${step % 16 === 0 && step !== 0 ? 'border-l-2 border-[#b1d43d40] pl-1' : ''}`}
                    >
                      {subSteps.map((pitch) => {
                        const isActive = track.notes[step]?.includes(pitch);
                        const isPlayingNote = isActive && step === currentStep;
                        
                        return (
                          <div 
                            key={pitch}
                            onClick={() => onToggleNote(trackIdx, step, pitch)}
                            className={`flex-1 cursor-pointer transition-all duration-100 relative ${isActive ? 'pixel-border-embossed' : 'hover:bg-[#1d2c34]'}`}
                            style={{ 
                              backgroundColor: isActive ? track.color : '#12212a',
                              boxShadow: isPlayingNote ? `0 0 15px ${track.color}` : 'none',
                              zIndex: isPlayingNote ? 20 : 1,
                              opacity: isActive ? (step === currentStep ? 1 : 0.7) : 1
                            }}
                          >
                            {isPlayingNote && (
                              <div className="absolute inset-0 bg-white opacity-30 animate-pulse pointer-events-none"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {/* Vertical Playhead Column */}
                  <div 
                    className="absolute top-0 bottom-0 w-[4px] bg-white opacity-20 pointer-events-none transition-all duration-75 ease-linear z-30"
                    style={{ left: `calc(${(currentStep / 64) * 1600}px + 1px)` }}
                  ></div>
                  
                  {/* Bar Labels Overlays */}
                  {[0, 16, 32, 48].map(barStart => (
                    <div key={barStart} className="absolute top-0.5 pointer-events-none h-3" style={{ left: `calc(${(barStart / 64) * 1600}px + 4px)` }}>
                      <span className="text-[6px] font-black text-[#b1d43d60] uppercase letter-spacing-widest">
                        BAR 0{Math.floor(barStart / 16) + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex justify-between items-center border-t border-[#12212a] pt-2">
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-12 h-1.5 ${Math.floor(currentStep / 16) === i ? 'bg-[#b1d43d]' : 'bg-[#12212a]'} transition-colors pixel-border-embossed`}
              title={`Bar ${i + 1}`}
            ></div>
          ))}
        </div>
        <span className="text-[8px] text-outline uppercase font-bold tracking-widest leading-none">
          PATTERN SYNC // STEP: {(currentStep + 1).toString().padStart(2, '0')} / 64
        </span>
      </div>
    </section>
  );
};
