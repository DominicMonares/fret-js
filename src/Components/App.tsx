import { useEffect, useState } from 'react';

import Controls from './Controls';
import Workspace from './Workspace';
import Diagram from './Diagram';
import { removeExtraChars, translateFreq } from '../utils/freqTranslation';
import { detectPitch } from '../utils/detectPitch';
import logo from '../../assets/logo.png';
import { FretNum } from '../types';
import './App.css';


const context = new window.AudioContext;
const analyser = new AnalyserNode(context, { fftSize: 2048 });

const App = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [recordingStarted, setRecordingStarted] = useState<boolean>(false);
  const [shift, setShift] = useState<boolean>(false);
  const [input, setInput] = useState<string[]>([]);
  const [output, setOutput] = useState<string>('');
  const [fretNum, setFretNum] = useState<FretNum>(24);

  // Create audio context on page load
  useEffect(() => {
    navigator.getUserMedia(
      { audio: true },
      async () => await setupContext(),
      () => console.error('Context setup failed')
    );
  }, []);

  const setupContext = async () => {
    if (context.state === 'suspended') await context.resume();

    // Remove mic optimizations - prevents distortion, warble, and other audio glitches
    const audioSettings = {
      echoCancellation: false,
      autoGainControl: false,
      noiseSuppression: false,
      latency: 0
    }

    // Guitar stream - primary audio source
    const guitar = await navigator.mediaDevices.getUserMedia({ audio: audioSettings });
    const source = context.createMediaStreamSource(guitar);

    // Prevent distortion loop
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, context.currentTime);
    compressor.knee.setValueAtTime(40, context.currentTime);
    compressor.ratio.setValueAtTime(12, context.currentTime);
    compressor.attack.setValueAtTime(0, context.currentTime);
    compressor.release.setValueAtTime(0.25, context.currentTime);

    // Connect all nodes to destination
    source
      .connect(compressor)
      .connect(analyser)
      .connect(context.destination);
  }

  // Control recording behavior
  useEffect(() => {
    if (recording) {
      record([]);
    } else if (!recording && recordingStarted) {
      setRecordingStarted(false);
      stopRecording();
    }
  });

  const record = (batch: string[]) => {
    if (recording) {
      // Find fundamental frequency
      const bufferSize = analyser.fftSize;
      const buffer = new Float32Array(bufferSize);
      analyser.getFloatTimeDomainData(buffer);
      const fundamentalFreq = detectPitch(buffer, context.sampleRate);

      // Translate freq and add note to batch if within range
      // Batch tracks every char recorded when a single note is played
      // 59.91-1207.63 is freq range for B1-D6 (22 fret)
      // 65.18-1382.51 is freq range for C#2-E6 (24 fret)
      const in22Range = fretNum === 22 && (fundamentalFreq > 59.91 && fundamentalFreq < 1207.63);
      const in24Range = fretNum === 24 && (fundamentalFreq > 65.18 && fundamentalFreq < 1382.51);
      if (in22Range || in24Range) {
        const newBatch = batch.slice();
        const char = translateFreq(shift, fundamentalFreq, fretNum);
        newBatch.push(char);

        window.requestAnimationFrame(() => record(newBatch));
      } else if (fundamentalFreq === -1) { // No freq - note is finished playing
        if (batch.length > 5) { // Helps to prevent straggler frequencies
          const char = removeExtraChars(batch);
          saveChar(char);
        } else {
          window.requestAnimationFrame(() => record([]));
        }
      } else {
        window.requestAnimationFrame(() => record(batch));
      }
    }
  }

  const stopRecording = () => {
    // Execute code that the user wrote once recording is stopped
    let newOutput;
    try {
      newOutput = eval(`(${input.join('')})`); // Never use eval on an app that needs security!
    } catch (err: any) { // Can be any type of error
      newOutput = err.toString();
    }

    setOutput(newOutput);
  }

  const clearRecording = () => {
    setRecording(false);
    setRecordingStarted(false);
    setShift(false);
    setInput([]);
    setOutput('');
  }

  // Add translated char to input tracker
  const saveChar = (char: string) => {
    const newinput = input.slice();
    if (char !== '') {
      if (char === 'shift') {
        setShift(prev => !prev);
      } else if (char === 'del') {
        newinput.pop();
        setInput(newinput);
      } else if (char === 'run') {
        setRecording(false);
      } else {
        newinput.push(char);
        setInput(newinput);
      }
    }
  }

  return (
    <div id="app">
      <div className="logo-container">
        <span className="logo">fretJS</span>
      </div>
      <Controls
        setFretNum={setFretNum}
        fretNum={fretNum}
        recording={recording}
        setRecording={setRecording}
        setRecordingStarted={setRecordingStarted}
        clearRecording={clearRecording}
        output={output}
      />
      <Workspace shift={shift} input={input} output={output} />
      <Diagram fretNum={fretNum} shift={shift} />
    </div>
  );
}

export default App;
