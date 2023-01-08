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
    const rangeAmount = pivot < 19 ? 2 : pivot < 30 ? 6 : pivot < 40 ? 10 : 20 // Higher freqs have higher ranges
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

export const translateFreq = (shift: boolean, freq: any) => { // TEMP ANY
  const noteNode = findClosestNote(freq);
  return !shift ? noteNode['keys'][0] : noteNode['keys'][1];
}

export const removeOvertones = (batch: any): any => { // TEMP ANY, MAKE TYPE
  const tones: any = {}; // TEMP ANY
  batch.forEach((t: string) => {
    !tones[t[0]] ? tones[t[0]] = { count: 1, freq: t[1] } : tones[t[0]]['count']++;
  });

  let mostTones: any[] = ['', 0, 0]; // TEMP ANY | key, count, freq
  for (let t in tones) {
    const currentFreq = tones[t]['freq'];
    const storedFreq = mostTones[2];
    const higherFreq = currentFreq > storedFreq && currentFreq >= 4;
    const lowerFreq = currentFreq < storedFreq;
    const higherCount = tones[t]['count'] > mostTones[1];
    if ((higherCount && !lowerFreq) || higherFreq) mostTones = [t, tones[t]['count'], tones[t]['freq']];
  }

  return mostTones[0];
}