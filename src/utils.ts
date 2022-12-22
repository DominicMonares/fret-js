export const findFundamentalFreq = (buffer: any, sampleRate: number) => { // TEMP ANY, MAKE TYPE
  const n = 1024
  let bestR = 0
  let bestK = -1;
  for (let k = 8; k <= 6000; k++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      let signal1 = (buffer[i] - 127.5) / 127.5;
      let signal2 = (buffer[i + k] - 127.5) / 127.5;
      sum += signal1 * signal2;
    }

    let r = sum / n;
    if (r > bestR) {
      bestR = r;
      bestK = k;
    }

    if (r > 0.9) break;
  }


  if (bestR > 0.0025) {
    return sampleRate / bestK;
  } else {
    return -1;
  }
}

export const findClosestNote = (freq: number, notes: any) => { // TEMP ANY, MAKE TYPE
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

const removeOvertones = (notes: any): string | number | null => { // TEMP ANY, MAKE TYPE
  let noteNode = [null, 0];
  for (let i = 0; i < notes.length - 1; i++) {
    if (noteNode[1] && notes[i][1] > noteNode[1]) {
      noteNode = [notes[i][0], notes[i][1]];
    }
  }

  return noteNode[0];
}
