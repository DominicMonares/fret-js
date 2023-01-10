import { BatchItem, Batch, MostTones, Tones } from '../types';
import notes from '../../notes.json';


export const findClosestNote = (targetFreq: number) => {
  // Search notes.json for closest freq match
  let start = 0;
  let end = notes.length - 1;
  let pivot = Math.floor((start + end) / 2);

  while (end > start) {
    // Valid freq range increases the higher the freq is
    const rangeAmount = pivot < 15 ? 1.9 : pivot < 19 ? 3 : pivot < 30 ? 6 : pivot < 40 ? 10 : 20;
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

export const removeExtraTones = (batch: Batch) => {
  // Store all tones and track the number of times they were recorded
  const tones: Tones = {};
  batch.forEach((t: BatchItem) => {
    const char = t[0];
    const freq = t[1];
    !tones[char] ? tones[char] = { count: 1, freq: freq } : tones[char]['count']++;
  });

  // Find the most relevant tone based on the octave and count
  let mostTones: MostTones = ['', 0, 0]; // Char, Count, Freq
  for (let t in tones) {
    // Notes in and over the 4th octave pick up more undertones
    // Notes below the 4th octave pick up more overtones
    const count = tones[t]['count'];
    const freq = tones[t]['freq'];
    const storedFreq = mostTones[2];
    const higherFreq = freq > storedFreq && freq > 122.1; // B2 - CHANGE
    const lowerFreq = freq < storedFreq;
    const higherCount = count > mostTones[1];
    if ((higherCount && !higherFreq) || higherFreq) mostTones = [t, count, freq];
  }

  return mostTones[0];
}
