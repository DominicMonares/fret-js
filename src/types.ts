export type BatchItem = [string, number];

export type Batch = BatchItem[];

export type MostTones = [string, number, number];

export interface Note {
  note: string,
  frequency: number
}

export type Notes = Note[];

export interface Tone {
  count: number,
  freq: number
}

export interface Tones {
  [key: string]: Tone
}
