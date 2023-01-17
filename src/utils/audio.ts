import makeDistortionCurve from "./makeDistortionCurve";

export const context = new window.AudioContext;

// Prevent distortion loop
export const compressor = context.createDynamicsCompressor();
compressor.threshold.setValueAtTime(-50, context.currentTime);
compressor.knee.setValueAtTime(40, context.currentTime);
compressor.ratio.setValueAtTime(12, context.currentTime);
compressor.attack.setValueAtTime(0, context.currentTime);
compressor.release.setValueAtTime(0.25, context.currentTime);

// Get audio data
export const analyser = new AnalyserNode(context, { fftSize: 2048 });

// Distortion effect
const distortionGainNode = context.createGain();
export const distortion = context.createWaveShaper();
distortion.curve = makeDistortionCurve(0, context.sampleRate);

// Connect all nodes to destination
export const setupContext = async () => {
  if (context.state === 'suspended') await context.resume();

  // Remove mic optimizations - prevents unwanted distortion, warble, and other audio glitches
  const audioSettings = {
    echoCancellation: false,
    autoGainControl: false,
    noiseSuppression: false,
    latency: 0
  }

  // Guitar stream - primary audio source
  const guitar = await navigator.mediaDevices.getUserMedia({ audio: audioSettings });
  const source = context.createMediaStreamSource(guitar);

  source
    .connect(compressor)
    .connect(analyser)
    .connect(distortionGainNode)
    .connect(distortion)
    .connect(context.destination);
}
