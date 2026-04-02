/**
 * MusicHelper: AIの生成した音を音楽的に補正するエンジン (Musical Profile Edition)
 */

export type ScaleType = 'major' | 'minor' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian';

export interface MusicalProfile {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  progressions: number[][];
  bassPattern: 'walking' | 'octave' | 'syncopated' | 'steady';
  drumStyle: 'standard' | 'aggressive' | 'minimal';
}

export const MUSICAL_PROFILES: Record<string, MusicalProfile> = {
  adventure: {
    id: 'adventure',
    name: 'ADVENTURE',
    description: '明るく前向きな冒険の始まり',
    color: '#b1d43d',
    icon: 'map',
    progressions: [[1, 5, 6, 4], [1, 4, 5, 1]], // I-V-vi-IV, I-IV-V-I
    bassPattern: 'walking',
    drumStyle: 'standard'
  },
  battle: {
    id: 'battle',
    name: 'BATTLE',
    description: '緊張感のある激しい戦闘',
    color: '#ffb5a0',
    icon: 'swords',
    progressions: [[6, 4, 2, 5], [6, 7, 1, 6]], // vi-IV-ii-V, vi-VII-I-vi
    bassPattern: 'octave',
    drumStyle: 'aggressive'
  },
  town: {
    id: 'town',
    name: 'TOWN',
    description: '賑やかで平和な街の風景',
    color: '#9dd496',
    icon: 'home',
    progressions: [[1, 6, 4, 5], [2, 5, 1, 6]], // I-vi-IV-V, ii-V-I-vi
    bassPattern: 'syncopated',
    drumStyle: 'standard'
  },
  dungeon: {
    id: 'dungeon',
    name: 'DUNGEON',
    description: '不気味で何かが潜む洞窟',
    color: '#a0a0ff',
    icon: 'visibility',
    progressions: [[1, 2, 1, 2], [6, 3, 6, 3]], // 半音や減音傾向
    bassPattern: 'steady',
    drumStyle: 'minimal'
  }
};

export const SCALES: Record<ScaleType, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
};

const NOTE_TO_OFFSET: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
};

export class MusicHelper {
  static getChordNotes(rootOffset: number, scaleType: ScaleType, degree: number): number[] {
    const scale = SCALES[scaleType] || SCALES.major;
    const rootIdx = (degree - 1) % 7;
    const chordSteps = [0, 2, 4];
    return chordSteps.map(step => {
      const idx = (rootIdx + step) % 7;
      let offset = scale[idx];
      if (idx < rootIdx) offset += 12;
      return (rootOffset + offset) % 12;
    });
  }

  /**
   * AIの生成したノートを Musical Profile に基づいて補正する
   */
  static applyStyle(rawNotes: any[], profileId: string, keyRoot: string, scaleType: ScaleType): any[] {
    const profile = MUSICAL_PROFILES[profileId] || MUSICAL_PROFILES.adventure;
    const rootOffset = NOTE_TO_OFFSET[keyRoot] || 0;
    const scale = SCALES[scaleType] || SCALES.major;
    const fullScale = scale.map(s => (s + rootOffset) % 12);
    
    // コード進行の決定（今回はシンプルにランダム選定したものを全小節分用意）
    const progression = profile.progressions[Math.floor(Math.random() * profile.progressions.length)];
    
    const processedNotes: any[] = [];
    const bar1Patterns: Record<string, Record<number, number>> = { lead: {}, bass: {} };

    // 処理中に直前のリードピッチを保持（輪郭保存のため）
    let lastLeadPitch = -1;

    rawNotes.forEach(note => {
      const step = note.quantizedStartStep || 0;
      if (step >= 64) return;

      const barIdx = Math.floor(step / 16);
      const degree = progression[barIdx % 4];
      const chordOffsets = this.getChordNotes(rootOffset, scaleType, degree);
      
      let newPitch = note.pitch;

      if (note.isDrum) {
        // --- DRUM: Intent Preservation ---
        // AIのリズムを活かしつつ、強拍にアクセントを足す
        const isStrongBeat = step % 8 === 0;
        const isBackBeat = step % 8 === 4;
        
        if (isStrongBeat) newPitch = 36; // Kick always prioritized
        else if (isBackBeat) newPitch = 38; // Snare always prioritized
        else {
          // AIが元々鳴らしていた音を 8-bit パーカッションにマップ
          if (note.pitch === 36 || note.pitch === 35) newPitch = 36;
          else if (note.pitch === 38 || note.pitch === 40) newPitch = 38;
          else newPitch = 42; // Closed Hat / Noise
        }
      } else {
        const isLead = note.pitch >= 60;
        const subStep = step % 16;
        const isOnBeat = subStep % 4 === 0;

        if (!isLead) {
          // --- BASS: Pattern Logic ---
          const oct = Math.floor(note.pitch / 12);
          const rootNote = oct * 12 + chordOffsets[0];

          switch (profile.bassPattern) {
            case 'octave':
              // Battleなど：オクターブやルート-5度の激しい動き
              newPitch = (subStep % 8 < 4) ? rootNote : (rootNote + 12);
              break;
            case 'walking':
              // Adventureなど：安定した動き
              if (isOnBeat) newPitch = rootNote;
              else newPitch = this.snapToNotes(note.pitch, chordOffsets, 1.0);
              break;
            case 'syncopated':
              // Townなど：リズムに遊び
              if (subStep % 8 === 0 || subStep % 8 === 3 || subStep % 8 === 6) {
                newPitch = rootNote;
              } else {
                newPitch = this.snapToNotes(note.pitch, chordOffsets, 0.8);
              }
              break;
            default:
              newPitch = rootNote;
          }
          if (barIdx === 0) bar1Patterns.bass[step] = newPitch;
        } else {
          // --- LEAD: Contour Preservation ---
          if (isOnBeat) {
            // 強拍はコード音
            newPitch = this.snapToNotes(note.pitch, chordOffsets, 1.0);
          } else {
            // 弱拍は「AIの動き」を重視
            // 前の音より高いか低いかを維持しつつ、スケール音にスナップ
            const targetPitch = lastLeadPitch !== -1 
              ? (note.pitch > lastLeadPitch ? Math.max(newPitch, lastLeadPitch + 1) : Math.min(newPitch, lastLeadPitch - 1))
              : note.pitch;
            
            newPitch = this.snapToNotes(targetPitch, fullScale, 1.0);
          }
          lastLeadPitch = newPitch;
          if (barIdx === 0) bar1Patterns.lead[step] = newPitch;

          // 終止形 (Cadence): 最後のステップをルートに寄せる
          if (step === 63) {
            newPitch = Math.floor(newPitch / 12) * 12 + rootOffset;
          }
        }
      }

      // 3小節目リフレイン
      if (!note.isDrum && barIdx === 2) {
        const relativeStep = step % 16;
        const type = note.pitch >= 60 ? 'lead' : 'bass';
        if (bar1Patterns[type][relativeStep] !== undefined) {
          const originalPitch = bar1Patterns[type][relativeStep];
          const oct = Math.floor(note.pitch / 12);
          // 今のコードに合わせてピッチをスライド
          newPitch = this.snapToNotes(oct * 12 + (originalPitch % 12), chordOffsets, 0.9);
        }
      }
      
      processedNotes.push({ ...note, pitch: newPitch });
    });

    return processedNotes;
  }

  private static snapToNotes(pitch: number, allowedOffsets: number[], probability: number): number {
    if (Math.random() > probability) return pitch;
    const oct = Math.floor(pitch / 12);
    const noteInOct = pitch % 12;
    let closest = allowedOffsets[0];
    let minDiff = 12;
    allowedOffsets.forEach(off => {
      const diff = Math.min(Math.abs(off - noteInOct), 12 - Math.abs(off - noteInOct));
      if (diff < minDiff) {
        minDiff = diff;
        closest = off;
      }
    });
    return oct * 12 + closest;
  }
}
