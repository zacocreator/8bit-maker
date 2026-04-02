/**
 * MusicHelper: AIの生成した音を音楽的な型（コード進行・リズム）に補正するエンジン
 */

export interface CompositionStyle {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  chords: string[]; // 4小節分のコード名
  rhythm: 'straight' | 'syncopated' | 'march';
}

export const COMPOSITION_STYLES: CompositionStyle[] = [
  {
    id: 'adventure',
    name: 'ADVENTURE',
    description: '明るい王道進行 (I-V-vi-IV)',
    color: '#b1d43d',
    icon: 'map',
    chords: ['C', 'G', 'Am', 'F'],
    rhythm: 'straight'
  },
  {
    id: 'battle',
    name: 'BATTLE',
    description: '緊張感のある進行 (i-VI-iv-V)',
    color: '#ffb5a0',
    icon: 'swords',
    chords: ['Am', 'F', 'Dm', 'E'],
    rhythm: 'syncopated'
  },
  {
    id: 'stadium',
    name: 'STADIUM',
    description: '壮大な進行 (IV-V-iii-vi)',
    color: '#9dd496',
    icon: 'emoji_events',
    chords: ['F', 'G', 'Em', 'Am'],
    rhythm: 'march'
  },
  {
    id: 'mystery',
    name: 'MYSTERY',
    description: '半音階の不気味な進行',
    color: '#a0a0ff',
    icon: 'visibility',
    chords: ['Am', 'Bb', 'Am', 'Bb'],
    rhythm: 'syncopated'
  }
];

// コード名から構成音（MIDI番号のオフセット）を取得
const CHORD_MAP: Record<string, number[]> = {
  'C': [0, 4, 7], 'G': [7, 11, 14], 'Am': [9, 12, 16], 'F': [5, 9, 12],
  'Dm': [2, 5, 9], 'E': [4, 8, 11], 'Em': [4, 7, 11], 'Bb': [10, 14, 17]
};

// メジャースケールのオフセット (C Major)
const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];

export class MusicHelper {
  /**
   * AIが生成したノートを、選択されたスタイル（コード進行・リズム）に適合させる
   * 厳格モード: 拍の頭をコード音に固定し、1小節目と3小節目に反復を持たせる
   */
  static applyStyle(rawNotes: any[], styleId: string): any[] {
    const style = COMPOSITION_STYLES.find(s => s.id === styleId) || COMPOSITION_STYLES[0];
    const processedNotes: any[] = [];
    
    // 1小節目（0-15ステップ）のメロディを記憶してリフレインを作る
    const bar1Melody: Record<number, number> = {};
    const bar1Bass: Record<number, number> = {};

    // 1. まず1小節目と2小節目を処理し、1小節目のパターンを記憶
    rawNotes.forEach(note => {
      const step = note.quantizedStartStep || 0;
      if (step >= 64) return;

      const barIdx = Math.floor(step / 16);
      const currentChord = style.chords[barIdx % 4];
      const chordOffsets = CHORD_MAP[currentChord] || [0, 4, 7];
      
      let newPitch = note.pitch;

      if (note.isDrum) {
        // ドラム: 厳格なスケルトン
        if (step % 8 === 0) newPitch = 36; // Kick
        else if (step % 8 === 4) newPitch = 38; // Snare
      } else {
        const isLead = note.pitch >= 60;
        const isOnBeat = step % 4 === 0;
        const isOnBarHead = step % 16 === 0;

        if (!isLead) {
          // --- BASS ---
          if (isOnBarHead || isOnBeat) {
            // 拍の頭は100%コードのルート音
            const oct = Math.floor(note.pitch / 12);
            newPitch = oct * 12 + chordOffsets[0];
          } else {
            // それ以外も厳格にコード音に寄せる
            newPitch = this.snapToChord(note.pitch, chordOffsets, 1.0);
          }
          if (barIdx === 0) bar1Bass[step] = newPitch;
        } else {
          // --- LEAD ---
          if (isOnBeat) {
            // 強拍は100%コード音
            newPitch = this.snapToChord(note.pitch, chordOffsets, 1.0);
          } else {
            // 弱拍も高い確率でコード音、最低でもスケール音
            newPitch = this.snapToScale(this.snapToChord(note.pitch, chordOffsets, 0.8));
          }
          if (barIdx === 0) bar1Melody[step] = newPitch;
        }
      }

      // 3小節目（リフレイン）の場合は、1小節目のパターンを優先（トランスポーズ付き）
      if (!note.isDrum && barIdx === 2) {
        const relativeStep = step % 16;
        if (note.pitch >= 60 && bar1Melody[relativeStep] !== undefined) {
          // 1小節目のメロディを現在のコードに移植
          newPitch = this.snapToChord(bar1Melody[relativeStep], chordOffsets, 1.0);
        } else if (note.pitch < 60 && bar1Bass[relativeStep] !== undefined) {
          // 1小節目のベースを現在のコードに移植
          newPitch = this.snapToChord(bar1Bass[relativeStep], chordOffsets, 1.0);
        }
      }

      processedNotes.push({ ...note, pitch: newPitch });
    });

    return processedNotes;
  }

  /**
   * 指定されたピッチを最も近いコード音にスナップさせる
   * @param probability スナップさせる確率 (0.0 - 1.0)
   */
  private static snapToChord(pitch: number, offsets: number[], probability: number = 1.0): number {
    if (Math.random() > probability) return pitch;

    const oct = Math.floor(pitch / 12);
    const noteInOct = pitch % 12;
    
    let closest = offsets[0];
    let minDiff = 12;
    
    offsets.forEach(off => {
      const offInOct = off % 12;
      const diff = Math.min(Math.abs(offInOct - noteInOct), 12 - Math.abs(offInOct - noteInOct));
      if (diff < minDiff) {
        minDiff = diff;
        closest = offInOct;
      }
    });

    return oct * 12 + closest;
  }

  /**
   * ピッチをスケール内の音にスナップさせる
   */
  private static snapToScale(pitch: number): number {
    const oct = Math.floor(pitch / 12);
    const noteInOct = pitch % 12;
    
    if (MAJOR_SCALE.includes(noteInOct)) return pitch;

    // 最も近いスケール音を探す
    let closest = MAJOR_SCALE[0];
    let minDiff = 12;
    
    MAJOR_SCALE.forEach(s => {
      const diff = Math.min(Math.abs(s - noteInOct), 12 - Math.abs(s - noteInOct));
      if (diff < minDiff) {
        minDiff = diff;
        closest = s;
      }
    });

    return oct * 12 + closest;
  }
}
