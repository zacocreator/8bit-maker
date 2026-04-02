import * as mm from '@magenta/music';

/**
 * MagentaService: The AI Brain of the 8-Bit DAW.
 * Reset to official stable model (trio_4bar) for developmental stability.
 */
class MagentaService {
  private musicVae: mm.MusicVAE | null = null;
  private isInitialized = false;

  constructor() {}

  async init(onProgress?: (progress: number) => void) {
    if (this.isInitialized) return;

    console.log('--- INITIALIZING STABLE AI BRAIN (trio_4bar) ---');
    
    // Using official Magenta checkpoint for speed and stability
    const TRIO_VAE_CHECKPOINT = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/trio_4bar';
    this.musicVae = new mm.MusicVAE(TRIO_VAE_CHECKPOINT);
    
    try {
      await this.musicVae.initialize();
      this.isInitialized = true;
      console.log('✅ AI BRAIN READY (Stable Mode)');
      if (onProgress) onProgress(100);
    } catch (error) {
      console.error('❌ Failed to load AI model:', error);
      throw error;
    }
  }

  /**
   * Generates a stable Trio sequence.
   * Calibrated temperature to balance creativity and musical structure.
   */
  async generateTrio(profileId: string): Promise<mm.INoteSequence | null> {
    if (!this.musicVae || !this.isInitialized) {
      console.warn('AI Brain not ready.');
      return null;
    }

    try {
      // Optimized temperature (0.9 - 1.2) - Higher for battle, lower for others to reduce "messiness"
      const temperature = profileId === 'battle' ? 1.2 : 0.95;
      
      // Sample multiple times (2x) and pick the one with better melodic density
      const results = await this.musicVae.sample(2, temperature, {}, 4, 120);
      
      if (results && results.length > 0) {
        let bestSeq = results[0];
        let maxLeadNotes = 0;

        results.forEach(seq => {
          const leadCount = seq.notes?.filter(n => !n.isDrum && n.pitch !== null && !!n.pitch && n.pitch >= 60).length || 0;
          if (leadCount > maxLeadNotes) {
            maxLeadNotes = leadCount;
            bestSeq = seq;
          }
        });

        return bestSeq;
      }
    } catch (error) {
      console.error('AI Generation Failed:', error);
    }
    return null;
  }
}

export const magentaService = new MagentaService();
