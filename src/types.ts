export interface Chars {
  [key: string]: number;
}

export interface ControlsProps {
  recording: boolean;
  output: string;
  fretNum: FretNum;
  setFretNum: (initialState: FretNum) => void;
  setRecording: (initialState: boolean) => void;
  setRecordingStarted: (initialState: boolean) => void;
  clearRecording: () => void;
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

export interface FretboardProps {
  diagram: Diagram;
  shift: boolean;
}

export type FretNum = 22 | 24;

export interface DiagramProps {
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

export interface WorkspaceProps {
  shift: boolean;
  input: string[];
  output: string;
}
