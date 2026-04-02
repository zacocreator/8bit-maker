import React, { useState, useEffect } from 'react';
import { TrackSidebar } from './components/TrackSidebar';
import { AIGeneratorCore } from './components/AIGeneratorCore';
import { SequencerMatrix } from './components/SequencerMatrix';
import { Visualizer } from './components/Visualizer';
import { ControlPanel } from './components/ControlPanel';
import { magentaService } from './lib/magentaService';
import { audioEngine } from './lib/audioEngine';
import { MidiService } from './lib/midiService';
import { StorageService } from './lib/storageService';
import { MusicHelper } from './lib/musicHelper';
import * as Tone from 'tone';

const App: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeMood, setActiveMood] = useState('meadow');
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState<any[]>([]);
  const [activeStyle, setActiveStyle] = useState('adventure');
  const [isModelsReady, setIsModelsReady] = useState(false);

  // Initial Load
  useEffect(() => {
    const initModels = async () => {
      try {
        await magentaService.init();
        setIsModelsReady(true);
      } catch (err) {
        console.error("Failed to load AI models:", err);
      }
    };
    initModels();
  }, []);

  // Initial Track State & Recovery
  useEffect(() => {
    try {
      const saved = StorageService.loadPattern();
      if (saved && Array.isArray(saved.tracks)) {
        setTracks(saved.tracks);
        setBpm(saved.bpm || 120);
        setActiveMood(saved.mood || 'meadow');
        console.log('Restored pattern from localStorage');
      } else {
        throw new Error('No valid saved pattern found');
      }
    } catch (e) {
      console.warn('Initializing with default tracks...');
      setTracks([
        { id: 'lead', name: 'SQUARE LEAD', sub: 'PIKACHU.WAV', color: '#b1d43d', icon: 'electric_bolt', notes: {} },
        { id: 'bass', name: 'TRIANGLE BASS', sub: 'SNORLAX.8BT', color: '#9dd496', icon: 'change_history', notes: {} },
        { id: 'perc', name: 'NOISE DRUMS', sub: 'KOFFING.PRC', color: '#ffb5a0', icon: 'skull', notes: {} },
      ]);
    }
  }, []);

  // Audio Engine Step Trigger
  useEffect(() => {
    if (!isPlaying) return;

    try {
      tracks.forEach(track => {
        const stepNotes = track.notes[currentStep];
        if (stepNotes && Array.isArray(stepNotes)) {
          stepNotes.forEach((pitch: number) => {
            if (pitch === undefined || pitch === null || isNaN(pitch)) return;
            const note = Tone.Frequency(pitch, "midi").toNote();
            
            if (track.id === 'lead') {
              audioEngine.playLead(note);
            } else if (track.id === 'bass') {
              audioEngine.playBass(note);
            } else if (track.id === 'perc') {
               audioEngine.playPerc();
            }
          });
        }
      });
    } catch (error) {
      console.error("Playback loop error:", error);
    }
  }, [currentStep, isPlaying, tracks]);

  useEffect(() => {
    audioEngine.setBPM(bpm);
  }, [bpm]);

  const togglePlayback = async () => {
    if (!isPlaying) {
      await audioEngine.init();
      audioEngine.startTransport();
    } else {
      audioEngine.stopTransport();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep(s => (s + 1) % 64);
      }, (60000 / bpm) / 4);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isPlaying, bpm]);

  const handleGenerate = async () => {
    if (!isModelsReady) return;
    
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => setProgress(p => (p >= 90 ? 90 : p + 10)), 150);

    try {
      const result = await magentaService.generateTrio(activeMood); 
      if (result && result.notes) {
        // --- APPLY MUSICAL STRUCTURE FILTER ---
        const processedNotes = MusicHelper.applyStyle(result.notes, activeStyle);
        
        setTracks(prev => prev.map(t => {
          const quantized: Record<number, number[]> = {};
          processedNotes.forEach((n: any) => {
            let isTarget = false;
            if (t.id === 'lead' && !n.isDrum && n.pitch >= 60) isTarget = true;
            if (t.id === 'bass' && !n.isDrum && n.pitch < 60) isTarget = true;
            if (t.id === 'perc' && n.isDrum) isTarget = true;

            if (isTarget) {
              const step = (n.quantizedStartStep !== undefined) 
                ? n.quantizedStartStep 
                : Math.floor((n.startTime || 0) * (bpm / 60) * 4);
              
              if (step >= 64) return;
              
              if (!quantized[step]) quantized[step] = [];
              if (!quantized[step].includes(n.pitch)) {
                quantized[step].push(n.pitch);
              }
            }
          });
          return { ...t, notes: quantized };
        }));
      }
    } catch (err) {
      console.error("AI Generation failed:", err);
    } finally {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setIsGenerating(false), 500);
    }
  };

  const handleToggleNote = (trackIdx: number, step: number, pitch: number) => {
    setTracks(prev => {
      const updated = [...prev];
      const currentNotes = updated[trackIdx].notes[step] || [];
      updated[trackIdx].notes[step] = currentNotes.includes(pitch) 
        ? currentNotes.filter((p: number) => p !== pitch) 
        : [...currentNotes, pitch];
      return updated;
    });
  };

  const handleSave = () => {
    StorageService.savePattern(tracks, bpm, activeMood);
    alert('パターンを保存しました！');
  };

  const handleExportMIDI = () => {
    MidiService.exportToMidi(tracks, bpm);
  };

  return (
    <div className="bg-surface text-on-surface font-body h-screen overflow-hidden select-none">
      {/* 1. Header with Visualizer */}
      <header className="fixed top-0 left-0 w-full z-50 grid grid-cols-[1fr_300px_1fr] items-center px-4 h-12 bg-[#05151d] border-b-2 border-[#021018] font-['Space_Grotesk'] uppercase tracking-tighter text-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black text-[#b1d43d] tracking-widest leading-none">POKÉMON 8-BIT COMPOSER</h1>
        </div>
        
        <div className="px-4 py-1">
          <Visualizer color="#b1d43d" height={32} />
        </div>

        <div className="flex items-center justify-end gap-6">
          <div className="flex items-center gap-2 text-[#b1d43d]">
            <span className="material-symbols-outlined text-sm">memory</span>
            <span className="font-bold">STEP: {currentStep + 1 < 10 ? `0${currentStep + 1}` : currentStep + 1}</span>
          </div>
        </div>
      </header>

      {/* 2. SideNavBar */}
      <TrackSidebar tracks={tracks} />

      {/* 3. Main Canvas */}
      <main className="ml-72 mt-12 mb-16 h-[calc(100vh-7rem)] overflow-y-auto p-6 bg-surface dither-bg">
        <div className="max-w-6xl mx-auto space-y-6">
          <AIGeneratorCore 
            activeMood={activeMood}
            setActiveMood={setActiveMood}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            progress={progress}
            isReady={isModelsReady}
            activeStyle={activeStyle}
            setActiveStyle={setActiveStyle}
          />
          
          <SequencerMatrix 
            tracks={tracks}
            currentStep={currentStep}
            onToggleNote={handleToggleNote}
          />

          <ControlPanel 
            onSave={handleSave} 
            onExportMIDI={handleExportMIDI} 
          />
        </div>
      </main>

      {/* 4. BottomNavBar (Simplified since Controls moved to ControlPanel) */}
      <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#05151d] border-t-4 border-[#021018] font-['Space_Grotesk'] uppercase text-[10px] tracking-widest">
        <div className="flex gap-4 items-center">
          <button 
            onClick={togglePlayback}
            className={`flex flex-col items-center justify-center w-20 h-12 pixel-border-embossed active:translate-y-[2px] transition-all ${isPlaying ? 'bg-[#ffb5a0] text-[#601400]' : 'bg-[#b1d43d] text-[#05151d]'}`}
          >
            <span className="material-symbols-outlined text-lg">{isPlaying ? 'pause' : 'play_arrow'}</span>
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>
          <button 
            onClick={() => { setIsPlaying(false); setCurrentStep(0); }}
            className="flex flex-col items-center justify-center text-[#42493f] border-2 border-[#283740] w-20 h-12 hover:bg-[#283740] hover:text-[#b1d43d] active:translate-y-[2px] transition-all"
          >
            <span className="material-symbols-outlined text-lg">stop</span>
            <span>STOP</span>
          </button>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-secondary font-bold">BPM: {bpm}</span>
            <div className="w-32 h-2 bg-[#021018] mt-1 relative pixel-border-debossed">
              <input 
                type="range" min="80" max="180" value={bpm} 
                onChange={(e) => setBpm(parseInt(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
              />
              <div style={{ width: `${((bpm - 80) / 100) * 100}%` }} className="h-full bg-secondary opacity-50"></div>
            </div>
          </div>
          <div className="flex flex-col items-center text-[#42493f]">
            <span className="material-symbols-outlined text-lg">grid_view</span>
            <span>BAR: {Math.floor(currentStep/16) + 1} / 04</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
