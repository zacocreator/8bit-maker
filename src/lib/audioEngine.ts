import * as Tone from 'tone';

export const OSC_TYPE_LEAD = 'square';
export const OSC_TYPE_BASS = 'triangle';
export const OSC_TYPE_PERC = 'noise';

/**
 * AudioEngine: Handles the Tone.js sound synthesis and effects chain.
 */
class AudioEngine {
  private leadSynth: any;
  private bassSynth: any;
  private chordSynth: any;
  private noiseSynth: any;
  private arpSynth: any;
  
  // Master Effects
  private mainOutput!: Tone.Channel;
  private masterFilter!: Tone.Filter;
  private masterBitCrusher!: Tone.BitCrusher;
  private analyser!: Tone.Analyser;
  
  private initialized: boolean = false;

  constructor() {
    // No-op for safe module loading during bootstrap
  }

  /**
   * Initializes the audio context and creates all synthesis nodes.
   * This must be called after a user gesture.
   */
  public async init() {
    if (this.initialized) return;
    
    try {
      // 1. Initialize Master Chain (Channel -> Filter -> Analyser -> Output)
      this.mainOutput = new Tone.Channel().toDestination();
      this.masterFilter = new Tone.Filter(10000, "lowpass").connect(this.mainOutput);
      this.masterBitCrusher = new Tone.BitCrusher(8).connect(this.masterFilter);
      this.analyser = new Tone.Analyser("waveform", 256);
      this.masterFilter.connect(this.analyser);
      
      // 2. Initialize Synths and connect to Effects Chain
      this.leadSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'pulse', width: 0.5 },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.4, release: 0.15 }
      }).connect(this.masterBitCrusher);

      this.chordSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'pulse', width: 0.5 },
        envelope: { attack: 0.02, decay: 0.2, sustain: 0.4, release: 0.4 }
      }).connect(this.masterBitCrusher);

      this.arpSynth = new Tone.Synth({
        oscillator: { type: 'pulse', width: 0.5 },
        envelope: { attack: 0.001, decay: 0.05, sustain: 0.5, release: 0.05 }
      }).connect(this.masterBitCrusher);

      this.bassSynth = new Tone.MonoSynth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.2 },
        filter: { Q: 1, type: 'lowpass', rolloff: -12 },
        filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.5, baseFrequency: 200, octaves: 3 }
      }).connect(this.masterBitCrusher);

      this.noiseSynth = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0 }
      }).connect(this.masterBitCrusher);

      // 3. Start Tone.js context
      await Tone.start();
      this.initialized = true;
      console.log('✅ Audio engine initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Audio Engine:', error);
      throw error;
    }
  }

  /**
   * Returns real-time waveform data for the visualizer
   */
  public getWaveformData() {
    if (!this.initialized) return null;
    return this.analyser.getValue();
  }

  /**
   * Set Master Volume (0 to 1)
   */
  public setMasterVolume(value: number) {
    if (!this.initialized) return;
    this.mainOutput.volume.value = Tone.gainToDb(value);
  }

  /**
   * Set Master BitCrusher depth (1 to 8)
   */
  public setBitCrush(bits: number) {
    if (!this.initialized) return;
    this.masterBitCrusher.bits.value = bits;
  }

  /**
   * Set Master Lowpass Filter frequency (20 to 20000)
   */
  public setFilterFrequency(freq: number) {
    if (!this.initialized) return;
    this.masterFilter.frequency.rampTo(freq, 0.1);
  }

  public cancelAllEvents() {
    Tone.getTransport().cancel();
  }

  public releaseAll() {
    [this.leadSynth, this.bassSynth, this.chordSynth, this.arpSynth].forEach(synth => {
      if (synth && typeof synth.releaseAll === 'function') {
        synth.releaseAll();
      } else if (synth) {
        synth.triggerRelease();
      }
    });

    if (this.noiseSynth) {
      this.noiseSynth.triggerRelease();
    }
  }

  public playChord(notes: string[], duration: string = '4n', time?: number | string) {
    if (this.chordSynth) this.chordSynth.triggerAttackRelease(notes, duration, time);
  }

  public playArpeggio(notes: string[], time?: number | string) {
    if (!this.arpSynth) return;
    const now = Tone.now();
    const startTime = typeof time === 'number' ? time : now;
    
    notes.forEach((note, i) => {
      this.arpSynth.triggerAttackRelease(note, '32n', startTime + (i * 0.05));
    });
  }

  public playLead(note: string, duration: string = '8n', time?: number | string) {
    if (this.leadSynth) this.leadSynth.triggerAttackRelease(note, duration, time);
  }

  public playBass(note: string, duration: string = '8n', time?: number | string) {
    if (this.bassSynth) this.bassSynth.triggerAttackRelease(note, duration, time);
  }

  public playPerc(time?: number | string) {
    if (this.noiseSynth) this.noiseSynth.triggerAttack(time);
  }

  public setBPM(bpm: number) {
    Tone.getTransport().bpm.value = bpm;
  }

  public async startTransport() {
    if (Tone.getContext().state !== 'running') {
      await Tone.start();
    }
    Tone.getTransport().start();
  }

  public stopTransport() {
    Tone.getTransport().stop();
    this.releaseAll();
  }

  public now() {
    return Tone.now();
  }

  public getTransportSeconds() {
    return Tone.getTransport().seconds;
  }
}

export const audioEngine = new AudioEngine();
