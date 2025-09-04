export type Clef = 'treble' | 'bass' | 'alto';

export type NoteAccidental = '#' | 'b' | '♮' | '↑' | '↓' | ''; // ↑ and ↓ for quarter-tones

export interface Note {
  pitch: string; // e.g., "C4", "E♭5"
  accidental?: NoteAccidental;
}

export interface Chord {
  clef: Clef;
  notes: Note[];
}