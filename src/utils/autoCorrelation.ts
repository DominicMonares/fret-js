/*
The MIT License (MIT)
Copyright (c) 2014 Chris Wilson
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
  Big thanks to Chris Wilson for this algorithm and Alex Ellis for the breakdown/comments!
  https://github.com/cwilso/PitchDetect/blob/main/js/pitchdetect.js
  https://alexanderell.is/posts/tuner/tuner.js
*/


export const autoCorrelate = (buffer: Float32Array, sampleRate: number) => {
  // Get root mean square to see if there is enough signal
  let bufferSize = buffer.length;
  let rms = 0;
  buffer.forEach(b => rms += b * b);
  rms = Math.sqrt(rms / bufferSize);
  if (rms < 0.01) return -1; // Not enough signal

  // Find a range in the buffer where values are below the threshold
  let r1 = 0;
  let r2 = bufferSize - 1;
  let threshold = 0.2;

  // Walk up for r1
  for (let i = 0; i < bufferSize / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i;
      break;
    }
  }

  // Walk down for r2
  for (let i = 1; i < bufferSize / 2; i++) {
    if (Math.abs(buffer[bufferSize - i]) < threshold) {
      r2 = bufferSize - i;
      break;
    }
  }

  // Trim buffer to fit range and update bufferSize
  buffer = buffer.slice(r1, r2);
  bufferSize = buffer.length;

  // Create a new array of the sums of offsets to do the autocorrelation
  let offsetSums = new Array(bufferSize).fill(0);
  for (let i = 0; i < bufferSize; i++) {
    for (let j = 0; j < bufferSize - i; j++) {
      offsetSums[i] = offsetSums[i] + buffer[j] * buffer[j + i];
    }
  }

  // Find the last index where the current value is greater than the next one (the dip)
  let index = 0;
  while (offsetSums[index] > offsetSums[index + 1]) index++;

  // Iterate from that index through the end and find the max sum
  let maxVal = -1;
  let maxIndex = -1;
  for (let i = index; i < bufferSize; i++) {
    if (offsetSums[i] > maxVal) {
      maxVal = offsetSums[i];
      maxIndex = i;
    }
  }

  let T0 = maxIndex;

  // Not as sure about this part
  // From the original author:
  // Interpolation is parabolic interpolation. It helps with precision. We suppose that a parabola pass through the
  // three points that comprise the peak. 'a' and 'b' are the unknowns from the linear equation system and b/(2a) is
  // the "error" in the abscissa. Well x1,x2,x3 should be y1,y2,y3 because they are the ordinates.
  const x1 = offsetSums[T0 - 1];
  const x2 = offsetSums[T0];
  const x3 = offsetSums[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}
