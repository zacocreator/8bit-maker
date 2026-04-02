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
   */
  async generateTrio(mood: string): Promise<mm.INoteSequence | null> {
    if (!this.musicVae || !this.isInitialized) {
      console.warn('AI Brain not ready.');
      return null;
    }

    try {
      const temperature = mood === 'battle' ? 1.2 : 0.9;
      // Fixed 16 steps (1 bar) for the current grid
      const results = await this.musicVae.sample(1, temperature, {}, 4, 120);
      
      if (results && results.length > 0) {
        return results[0];
      }
    } catch (error) {
      console.error('AI Generation Failed:', error);
    }
    return null;
  }
}

export const magentaService = new MagentaService();
