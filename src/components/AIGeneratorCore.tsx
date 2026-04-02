import React from 'react';
import { MUSICAL_PROFILES } from '../lib/musicHelper';

interface AIGeneratorCoreProps {
  activeProfile: string;
  setActiveProfile: (profileId: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  progress: number;
  isReady: boolean;
  activeKey: string;
  setActiveKey: (key: string) => void;
  activeScaleType: string;
  setActiveScaleType: (type: any) => void;
}

export const AIGeneratorCore: React.FC<AIGeneratorCoreProps> = ({ 
  activeProfile, 
  setActiveProfile, 
  onGenerate, 
  isGenerating, 
  progress,
  isReady,
  activeKey,
  setActiveKey,
  activeScaleType,
  setActiveScaleType
}) => {
  const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
  const SCALES = [
    { id: 'major', label: 'MAJOR (Bright)' },
    { id: 'minor', label: 'MINOR (Dark)' },
    { id: 'dorian', label: 'DORIAN (Cool)' }
  ];

  const currentProfile = MUSICAL_PROFILES[activeProfile] || MUSICAL_PROFILES.adventure;
  const profilesList = Object.values(MUSICAL_PROFILES);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Scene Selector (Musical Profiles) */}
      <div className="lg:col-span-2 bg-[#0e1d26] p-6 pixel-border-embossed flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="font-headline text-sm font-bold text-[#b1d43d] uppercase tracking-widest leading-none">Select Musical Scene</h3>
          <span className="text-[8px] text-[#b1d43d60] animate-pulse">CORE MUSIC THEORY ENGINE: ON</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {profilesList.map((profile) => (
            <button 
              key={profile.id}
              onClick={() => setActiveProfile(profile.id)}
              className={`p-6 flex flex-col gap-3 transition-all pixel-border-embossed border-l-4 text-left group
                ${activeProfile === profile.id 
                  ? `bg-[#0e1d26] pixel-border-debossed` 
                  : `bg-[#1a2b36] hover:bg-[#283740]`}
              `}
              style={{ 
                borderLeftColor: activeProfile === profile.id ? profile.color : '#42493f',
              }}
            >
              <div className="flex justify-between items-start">
                <span className={`material-symbols-outlined text-3xl group-hover:scale-110 transition-transform`} style={{ color: activeProfile === profile.id ? profile.color : 'inherit' }}>{profile.icon}</span>
                {activeProfile === profile.id && <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: profile.color }}></div>}
              </div>
              <div>
                <span className="block font-headline text-sm font-bold tracking-widest" style={{ color: activeProfile === profile.id ? profile.color : 'white' }}>{profile.name}</span>
                <span className="block text-[8px] text-outline mt-1 leading-tight uppercase font-medium">{profile.description}</span>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[6px] px-1 bg-[#021018] text-[#b1d43d] rounded">STYLE: {profile.bassPattern.toUpperCase()}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Tonality Setup */}
      <div className="bg-[#0e1d26] p-6 pixel-border-embossed flex flex-col gap-4">
        <h3 className="font-headline text-sm font-bold text-[#b1d43d] uppercase tracking-widest leading-none">Tonality Setup</h3>
        
        <div className="flex-1 space-y-4">
          <div>
            <span className="text-[10px] text-outline-variant font-bold block mb-2 uppercase">Root Key</span>
            <div className="grid grid-cols-6 gap-1">
              {KEYS.map(k => (
                <button 
                  key={k}
                  onClick={() => setActiveKey(k)}
                  className={`py-2 text-[10px] font-bold transition-all pixel-border-embossed
                    ${activeKey === k ? 'bg-[#b1d43d] text-[#05151d]' : 'bg-[#283740] text-on-surface hover:bg-[#34444e]'}
                  `}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-outline-variant font-bold block mb-2 uppercase">Scale Type</span>
            <div className="flex flex-col gap-2">
              {SCALES.map(s => (
                <button 
                  key={s.id}
                  onClick={() => setActiveScaleType(s.id)}
                  className={`px-4 py-2 text-left text-[10px] font-bold transition-all pixel-border-embossed
                    ${activeScaleType === s.id ? 'bg-[#ffb5a0] text-[#601400]' : 'bg-[#283740] text-on-surface hover:bg-[#34444e]'}
                  `}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Central Hub: AI Generation Control */}
      <div className="lg:col-span-3 bg-[#0e1d26] p-8 pixel-border-embossed flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-12 h-full w-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-outline-variant"></div>
            ))}
          </div>
        </div>

        <div className="z-10 w-full flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
          <div className="text-left">
            <h2 className="font-headline text-3xl font-black text-[#b1d43d] mb-2 tracking-tighter uppercase leading-none">
              AI COMPOSE ENGINE
            </h2>
            <p className="text-[10px] text-outline uppercase font-bold tracking-widest">
              GENERATING <span style={{ color: currentProfile.color }}>{currentProfile.name}</span> IN {activeKey} {activeScaleType.toUpperCase()}
            </p>
          </div>
          
          <button 
            onClick={onGenerate}
            disabled={isGenerating || !isReady}
            className={`group relative flex items-center gap-6 p-8 bg-surface-container-lowest pixel-border-embossed hover:pixel-border-debossed active:scale-95 transition-all min-w-[320px]
              ${(!isReady) ? 'opacity-50 grayscale cursor-not-allowed' : ''}
            `}
          >
            <div className={`w-16 h-16 rounded-full border-4 border-tertiary flex items-center justify-center relative overflow-hidden bg-white 
                ${(!isReady) ? 'animate-pulse' : ''}
              `}>
              <div className="absolute top-0 w-full h-1/2 bg-tertiary border-b-4 border-[#021018]"></div>
              <div className="absolute w-4 h-4 rounded-full bg-white border-2 border-[#021018] z-20 shadow-lg">
                 <div className="w-full h-full border border-[#021018] rounded-full animate-pulse opacity-50 bg-[#021018]"></div>
              </div>
            </div>
            
            <div className="flex flex-col items-start">
              <span className="font-headline font-black text-xl text-on-surface leading-none uppercase">
                {!isReady ? 'LOADING AI...' : (isGenerating ? `COMPOSING...` : 'GENERATE BGM')}
              </span>
              <span className="text-[8px] text-outline mt-1 tracking-[0.2em] font-bold">ALGORITHM: V3_STRUCTURED_LOOP</span>
            </div>
            
            {isGenerating && (
              <div className="absolute bottom-0 left-0 h-1 bg-[#b1d43d] transition-all duration-300" style={{ width: `${progress}%` }}></div>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
