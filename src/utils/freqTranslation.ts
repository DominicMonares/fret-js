import { Chars } from '../types';
import notes from '../../notes.json';


export const translateFreq = (shift: boolean, freq: number) => {
  const noteNode = findClosestNote(freq);
  return !shift ? noteNode['chars'][0] : noteNode['chars'][1];
}

export const findClosestNote = (targetFreq: number) => {
  // Search notes.json for closest freq match
  let start = 0;
  let end = notes.length - 1;
  let pivot = Math.floor((start + end) / 2);

  while (end > start) {
    // Valid freq range increases the higher the freq is
    // const rangeAmount = pivot < 15 ? 1.9 : pivot < 19 ? 3 : pivot < 30 ? 6 : pivot < 40 ? 10 : 20;
    const rangeAmount = 1;
    const lowRange = notes[pivot]['frequency'] - rangeAmount;
    const inLowRange = targetFreq >= lowRange;
    const highRange = notes[pivot]['frequency'] + rangeAmount;
    const inHighRange = targetFreq <= highRange;

    if (inLowRange && inHighRange) {
      return notes[pivot];
    } else if (targetFreq < lowRange) {
      end = pivot - 1;
      pivot = Math.floor((start + end) / 2);
    } else if (targetFreq > highRange) {
      start = pivot + 1;
      pivot = Math.floor((start + end) / 2);
    }
  }

  return notes[start];
}

export const removeExtraChars = (batch: string[]) => {
  // Find most common char
  const chars: Chars = {};
  batch.forEach((c: string) => !chars[c] ? chars[c] = 1 : chars[c]++);

  let mostTones = ['', 0];
  for (let c in chars) {
    if (chars[c] > mostTones[0]) mostTones = [c, chars[c]];
  }

  return mostTones[0] as string;
}
