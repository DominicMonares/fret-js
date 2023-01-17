/*
  Big thanks to Alexander Leon for this algorithm!
  https://alexanderleon.medium.com/web-audio-series-part-2-designing-distortion-using-javascript-and-the-web-audio-api-446301565541
*/

const makeDistortionCurve = (amount: number, sampleRate: number) => {
  let k = amount;
  let n_samples = sampleRate ? sampleRate : 44100;
  let curve = new Float32Array(n_samples);
  let deg = Math.PI / 180;
  let i = 0;
  let x;

  for (; i < n_samples; ++i) {
    x = i * 2 / n_samples - 1;
    curve[i] = (3 + k) * Math.atan(Math.sinh(x * 0.25) * 5) / (Math.PI + k * Math.abs(x));
  }

  return curve;
}

export default makeDistortionCurve;
