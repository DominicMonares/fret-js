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

export const findClosestNote = (freq: number) => { // TEMP ANY, MAKE TYPE
  let low = -1
  let high = notes.length;
  while (high - low > 1) {
    let pivot = Math.round((low + high) / 2);
    notes[pivot].frequency <= freq ? low = pivot : high = pivot;
  }

  if (Math.abs(notes[high]?.frequency - freq) <= Math.abs(notes[low]?.frequency - freq)) {
    return [notes[high], high];
  }

  return [notes[low], low];
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
    if (noteNode[1] !== null && batch[i][1] > noteNode[1]) {
      noteNode = [batch[i][0], batch[i][1]];
    }
  }

  return noteNode[0];
}
