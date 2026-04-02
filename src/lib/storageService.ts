export interface SavedPattern {
  tracks: any[];
  bpm: number;
  profile: string;
  timestamp: number;
}

export class StorageService {
  private static STORAGE_KEY = '8bit_music_maker_pattern';

  /**
   * Saves the current sequence state to localStorage.
   */
  public static savePattern(tracks: any[], bpm: number, profile: string) {
    const data: SavedPattern = {
      tracks,
      bpm,
      profile,
      timestamp: Date.now()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    console.log('Pattern saved to localStorage');
  }

  /**
   * Retrieves the saved sequence state from localStorage.
   */
  public static loadPattern(): SavedPattern | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return null;
    
    try {
      return JSON.parse(data);
    } catch (err) {
      console.error('Failed to parse saved pattern:', err);
      return null;
    }
  }

  /**
   * Checks if a pattern exists in storage.
   */
  public static hasPattern(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }
}
