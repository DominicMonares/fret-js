import { Chars } from '../types';
import notes from '../../notes.json';


export const translateFreq = (shift: boolean, freq: number) => {
  const noteNode = findClosestNote(freq);
  return !shift ? noteNode['chars'][0] : noteNode['chars'][1];
}

export const findClosestNote = (targetFreq: number) => {
  let start = 0;
  let end = notes.length - 1;
  let pivot = Math.floor((start + end) / 2);

  while (end > start) {
    // Find midpoint between current freq and one of its neighbors
    // Choose lower freq when available so as not to overstep when checking lower range
    const firstFreq = notes[pivot]['frequency'];
    const secondFreq = notes[pivot > 0 ? pivot - 1 : pivot + 1]['frequency'];
    const midpoint = (firstFreq - secondFreq) / 2;

    // Use midpoint to find range of current freq
    const lowRange = firstFreq - midpoint;
    const highRange = firstFreq + midpoint;
    const inLowRange = targetFreq >= lowRange;
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
  const chars: Chars = {};
  batch.sort().forEach((c: string) => !chars[c] ? chars[c] = 1 : chars[c]++);

  let mostTones = ['', 0];
  for (let c in chars) if (chars[c] > mostTones[1]) mostTones = [c, chars[c]];
  return mostTones[0] as string;
}
