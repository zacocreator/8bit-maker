import React from 'react';
import { Zap, Activity } from 'lucide-react';

interface AIGeneratorModuleProps {
  isGenerating: boolean;
  onGenerate: () => void;
}

export const AIGeneratorModule: React.FC<AIGeneratorModuleProps> = ({ isGenerating, onGenerate }) => {
  return (
    <div className="module-panel p-6 flex flex-col gap-6 items-center w-full max-w-[600px] mx-auto">
      <div className="flex items-center justify-between w-full">
         <span className="text-[10px] font-pixel text-primary glow-active">[ AI_COMPOSE_ENGINE v2.0 ]</span>
         <div className="flex gap-2">
            <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-tertiary animate-ping' : 'bg-outline-variant'}`} />
            <Activity size={10} className={isGenerating ? 'text-tertiary animate-spin' : 'text-outline-variant'} />
         </div>
      </div>

      <div className="flex gap-8 w-full items-center">
        {/* Mood Grid */}
        <div className="well p-4 grid grid-cols-2 gap-3 flex-grow dither-bg">
           {['GRASS', 'FIRE', 'WATER', 'CAVE'].map(m => (
             <button key={m} className="pixel-button-tactile text-[9px] h-10 w-24">
               {m}
             </button>
           ))}
        </div>

        {/* Large Charging Button */}
        <div className="flex flex-col items-center gap-4">
           <button 
             onClick={onGenerate}
             disabled={isGenerating}
             className={`pixel-button-tactile pixel-button-primary w-24 h-24 flex flex-col items-center justify-center p-0 ${isGenerating ? 'animate-pulse opacity-50' : ''}`}
           >
             <Zap size={32} />
             <span className="text-[10px] font-bold mt-2">LINK</span>
           </button>
           <span className="text-[9px] font-pixel text-outline tracking-widest text-center uppercase">
              {isGenerating ? 'CHARGING...' : 'GENERATE_CORE'}
           </span>
        </div>
      </div>

      <div className="w-full h-1 bg-[#021018] relative overflow-hidden">
         <div className={`h-full bg-primary ${isGenerating ? 'w-full transition-all duration-[1200ms]' : 'w-0'}`} />
      </div>

      <p className="text-[9px] font-pixel text-outline-variant text-center leading-tight">
        STITCH_SYNTH_PROTOCOL ENABLED // CONNECTING TO AI_LATENT_SPACE
      </p>
    </div>
  );
};
