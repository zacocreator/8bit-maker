import * as mm from '@magenta/music';

/**
 * Service to handle MIDI export using Magenta.js
 */
export class MidiService {
  /**
   * Converts the sequencer state to a MIDI file and triggers a download.
   */
  public static exportToMidi(tracks: any[], bpm: number) {
    const notes: any[] = [];
    const stepsPerQuarter = 4; // 16th notes
    
    tracks.forEach(track => {
      Object.entries(track.notes).forEach(([stepStr, pitches]: [string, any]) => {
        const step = parseInt(stepStr);
        pitches.forEach((pitch: number) => {
          notes.push({
            pitch: pitch,
            startTime: step * (60 / bpm / stepsPerQuarter),
            endTime: (step + 1) * (60 / bpm / stepsPerQuarter),
            instrument: track.id === 'lead' ? 1 
                      : track.id === 'bass' ? 2 
                      : 3,
            isDrum: track.id === 'perc'
          });
        });
      });
    });

    const sequence: any = {
      notes,
      totalTime: 64 * (60 / bpm / stepsPerQuarter),
      tempos: [{ qpm: bpm }]
    };

    // Correct method path from investigation: exported via mm.core or spread into mm
    const midiBytes = (mm as any).sequenceProtoToMidi(sequence);
    this.downloadMidi(midiBytes, `8bit_comp_${new Date().getTime()}.mid`);
  }

  private static downloadMidi(bytes: Uint8Array, filename: string) {
    // Uint8Array should be cast to BlobPart array
    const blob = new Blob([bytes as any], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
