import notes from '../notes.json';


export const findFundamentalFreq = (buffer: any, sampleRate: number) => { // TEMP ANY, MAKE TYPE
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

export const findClosestNote = (targetFreq: number) => { // TEMP ANY, MAKE TYPE
  let start = 0;
  let end = notes.length - 1;
  let pivot = Math.floor((start + end) / 2);

  while (end > start) {
    const lowRange = notes[pivot]['frequency'] - 2;
    const inLowRange = targetFreq >= lowRange;
    const highRange = notes[pivot]['frequency'] + 2;
    const inHighRange = targetFreq <= highRange;

    if (inLowRange && inHighRange) {
      return [notes[pivot], pivot];
    } else if (targetFreq < lowRange) {
      end = pivot - 1;
      pivot = Math.floor((start + end) / 2);
    } else if (targetFreq > highRange) {
      start = pivot + 1;
      pivot = Math.floor((start + end) / 2);
    }
  }

  return [notes[start], start];
}

export const translateFreq = (shift: boolean, freq: any, batch: any) => { // TEMP ANY
  const notePair = findClosestNote(freq);
  const noteNode: any = notePair[0]; // TEMP ANY
  const noteIndex = notePair[1];
  const newCurrentBatch = batch;
  let noteKey;
  !shift ? noteKey = noteNode['keys'][0] : noteKey = noteNode['keys'][1];
  newCurrentBatch.push([noteKey, noteIndex]);
  return newCurrentBatch;
}

export const removeOvertones = (batch: any): string | number | null => { // TEMP ANY, MAKE TYPE
  let noteNode = [null, 0];
  for (let i = 0; i < batch.length; i++) {
    if (noteNode[1] !== null && batch[i][1] >= noteNode[1]) {
      noteNode = [batch[i][0], batch[i][1]];
    }
  }

  return noteNode[0];
}
