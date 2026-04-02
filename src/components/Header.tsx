import React from 'react';
import { Music, Activity, Bell } from 'lucide-react';

interface HeaderProps {
  loadError: string | null;
  isGenerating: boolean;
}

export const Header: React.FC<HeaderProps> = ({ loadError, isGenerating }) => {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-surface relative z-50">
      {/* 1. Track Identity (Left) */}
      <div className="flex items-center gap-3">
         <div className="w-10 h-10 module-panel flex items-center justify-center">
            <Music size={20} className="text-primary glow-active" />
         </div>
         <div className="flex flex-col">
            <span className="text-sm font-display font-bold tracking-widest text-[#D4E5F0] uppercase">
              POKÉMON 8-BIT COMPOSER
            </span>
            <span className="text-[8px] font-pixel text-outline uppercase mt-0.5">
               STITCH_CORE // DAW_INSTRUMENT_v2.0
            </span>
         </div>
      </div>

      {/* 2. Navigation Tabs (Center) - High Density Tactile Tabs */}
      <nav className="flex gap-1 p-1 well rounded-sm">
         {['DASHBOARD', 'SEQUENCER', 'MIXER'].map(tab => (
           <button 
             key={tab} 
             className={`px-4 py-1.5 text-[9px] font-bold font-display uppercase transition-all
               ${tab === 'SEQUENCER' 
                 ? 'bg-surface-highest text-primary glow-active shadow-[2px_2px_0_var(--color-surface-lowest)]' 
                 : 'text-outline hover:text-[#D4E5F0]'}`}
           >
             {tab}
           </button>
         ))}
      </nav>

      {/* 3. System Health (Right) */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
           <div className="flex items-center gap-2">
              <Activity size={10} className={isGenerating ? 'text-tertiary animate-spin' : 'text-outline-variant'} />
              <span className="text-[10px] font-pixel text-primary uppercase">TRIO_VAE_ACTIVE</span>
           </div>
           <div className="lcd-screen text-[8px] mt-1 uppercase">
              STEP_35 // 512_DIM
           </div>
        </div>
        
        <div className="relative">
           <Bell size={18} className="text-outline-variant" />
           {loadError && <div className="absolute -top-1 -right-1 w-2 h-2 bg-tertiary rounded-full animate-ping" />}
        </div>
      </div>
    </header>
  );
};
