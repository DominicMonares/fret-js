export interface Chars {
  [key: string]: number;
}

export interface Diagram {
  [key: string]: DiagramNode[];
}

export interface DiagramNode {
  main: boolean;
  chars: string[];
}

export type FindNote = (
  targetFreq: number,
  fretNum: FretNum
) => NoteNode;

export type FretNum = 22 | 24;

export interface FretProps {
  fretNum: FretNum;
  shift: boolean;
}

export interface NoteNode {
  note: string;
  frequency: number;
  chars: string[];
}

export type TranslateFreq = (
  shift: boolean,
  fundamentalFreq: number,
  fretNum: FretNum
) => string;
