import React from 'react';
import { COMPOSITION_STYLES } from '../lib/musicHelper';

interface AIGeneratorCoreProps {
  activeMood: string;
  setActiveMood: (mood: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  progress: number;
  isReady: boolean;
  activeStyle: string;
  setActiveStyle: (styleId: string) => void;
}

export const AIGeneratorCore: React.FC<AIGeneratorCoreProps> = ({ 
  activeMood, 
  setActiveMood, 
  onGenerate, 
  isGenerating, 
  progress,
  isReady,
  activeStyle,
  setActiveStyle
}) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Central Hub: AI Generation Control */}
      <div className="lg:col-span-2 bg-[#0e1d26] p-8 pixel-border-embossed flex flex-col items-center justify-center text-center relative overflow-hidden h-[360px]">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-12 h-full w-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-outline-variant"></div>
            ))}
          </div>
        </div>

        <div className="z-10 w-full">
          <h2 className="font-headline text-3xl font-black text-[#b1d43d] mb-6 tracking-tighter uppercase leading-none">
            AI COMPOSE ENGINE
          </h2>
          
          <button 
            onClick={onGenerate}
            disabled={isGenerating || !isReady}
            className={`group relative flex flex-col items-center justify-center p-12 bg-surface-container-lowest pixel-border-embossed hover:pixel-border-debossed active:scale-95 transition-all w-full max-w-sm mx-auto
              ${(!isReady) ? 'opacity-50 grayscale cursor-not-allowed' : ''}
            `}
          >
            <div className={`w-24 h-24 rounded-full border-8 border-tertiary flex items-center justify-center mb-4 relative overflow-hidden bg-white 
                ${(!isReady) ? 'animate-pulse' : ''}
              `}>
              <div className="absolute top-0 w-full h-1/2 bg-tertiary border-b-8 border-[#021018]"></div>
              <div className="absolute w-8 h-8 rounded-full bg-white border-4 border-[#021018] z-20 shadow-lg">
                 <div className="w-full h-full border border-[#021018] rounded-full animate-pulse opacity-50 bg-[#021018]"></div>
              </div>
            </div>
            
            <span className="font-headline font-black text-xl text-on-surface leading-none uppercase">
              {!isReady ? 'LOADING AI BRAIN...' : (isGenerating ? `ANALYZING... ${progress}%` : 'GENERATE 8-BIT BGM')}
            </span>
            <span className="text-[10px] text-outline mt-2 tracking-[0.2em] font-bold">ALGORITHM: RED_VERSION_0.9</span>
            
            {isGenerating && (
              <div className="absolute bottom-0 left-0 h-1 bg-[#b1d43d] transition-all duration-300" style={{ width: `${progress}%` }}></div>
            )}
          </button>
        </div>
      </div>

      {/* Mood Selector */}
      <div className="bg-[#0e1d26] p-6 pixel-border-embossed flex flex-col gap-4 h-[360px]">
        <h3 className="font-headline text-sm font-bold text-outline-variant uppercase tracking-widest leading-none">Mood Selector</h3>
        <div className="grid grid-cols-2 gap-3 flex-1">
          {[
            { id: 'meadow', label: 'MEADOW', icon: 'eco', color: 'secondary' },
            { id: 'battle', label: 'BATTLE', icon: 'fireplace', color: 'tertiary' },
            { id: 'town', label: 'TOWN', icon: 'location_city', color: 'primary' },
            { id: 'cave', label: 'CAVE', icon: 'landscape', color: 'outline' },
          ].map((mood) => (
            <button 
              key={mood.id}
              onClick={() => setActiveMood(mood.id)}
              className={`p-4 flex flex-col items-center justify-center gap-2 transition-all pixel-border-embossed border-l-4 group
                ${activeMood === mood.id 
                  ? `bg-[#0e1d26] pixel-border-debossed` 
                  : `bg-[#283740] hover:bg-surface-container-highest`}
              `}
              style={{ 
                borderLeftColor: activeMood === mood.id ? `var(--color-${mood.color})` : '#42493f',
                color: activeMood === mood.id ? `var(--color-${mood.color})` : 'inherit'
              }}
            >
              <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform`}>{mood.icon}</span>
              <span className="font-headline text-[10px] font-bold tracking-widest">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Style / Blueprint Selector */}
      <div className="bg-[#0e1d26] p-6 pixel-border-embossed flex flex-col gap-4 h-[360px] lg:col-span-3">
        <div className="flex justify-between items-center">
          <h3 className="font-headline text-sm font-bold text-[#b1d43d] uppercase tracking-widest leading-none">Composition Style (Structural Guidance)</h3>
          <span className="text-[8px] text-[#b1d43d60] animate-pulse">APPLYING MUSICAL STRUCTURE AFTER GENERATION</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMPOSITION_STYLES.map((style) => (
            <button 
              key={style.id}
              onClick={() => setActiveStyle(style.id)}
              className={`p-6 flex flex-col gap-3 transition-all pixel-border-embossed border-l-4 text-left group min-h-[140px]
                ${activeStyle === style.id 
                  ? `bg-[#0e1d26] pixel-border-debossed` 
                  : `bg-[#1a2b36] hover:bg-[#283740]`}
              `}
              style={{ 
                borderLeftColor: activeStyle === style.id ? style.color : '#42493f',
              }}
            >
              <div className="flex justify-between items-start">
                <span className={`material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform`} style={{ color: activeStyle === style.id ? style.color : 'inherit' }}>{style.icon}</span>
                {activeStyle === style.id && <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: style.color }}></div>}
              </div>
              <div>
                <span className="block font-headline text-sm font-bold tracking-widest" style={{ color: activeStyle === style.id ? style.color : 'white' }}>{style.name}</span>
                <span className="block text-[8px] text-outline mt-1 leading-tight uppercase font-medium">{style.description}</span>
                <div className="mt-2 flex gap-1">
                  {style.chords.map((c, i) => (
                    <span key={i} className="text-[6px] px-1 bg-[#021018] text-[#b1d43d] rounded">{c}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
