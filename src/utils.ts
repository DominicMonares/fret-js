import { Batch, BatchItem } from './types';
import notes from '../notes.json';


export const findFundamentalFreq = (buffer: Uint8Array, sampleRate: number) => {
  const n = 1024
  let bestRate = 0
  let bestKFrame = -1;
  for (let k = 8; k <= 6000; k++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const signal1 = (buffer[i] - 127.5) / 127.5;
      const signal2 = (buffer[i + k] - 127.5) / 127.5;
      sum += signal1 * signal2;
    }

    let r = sum / n;
    if (r > bestRate) {
      bestRate = r;
      bestKFrame = k;
    }

    if (r > 0.9) break;
  }

  return bestRate > 0.0025 ? sampleRate / bestKFrame : -1;
}

export const findClosestNote = (targetFreq: number) => {
  // Search notes.json for closest freq match
  let start = 0;
  let end = notes.length - 1;
  let pivot = Math.floor((start + end) / 2);

  while (end > start) {
    // Valid freq range increases the higher the freq is
    const rangeAmount = pivot < 19 ? 2 : pivot < 30 ? 6 : pivot < 40 ? 10 : 20;
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

export const translateFreq = (shift: boolean, freq: number) => {
  const noteNode = findClosestNote(freq);
  return !shift ? noteNode['chars'][0] : noteNode['chars'][1];
}

export const removeOvertones = (batch: Batch) => {
  let lowestTone = [batch[0][0], batch[0][1]];
  batch.forEach((t: BatchItem) => { if (t[1] > lowestTone[1]) lowestTone = [t[0], t[1]]});

  return lowestTone[0] as string;
}
