import { useEffect, useState } from 'react';

import { removeExtraChars, translateFreq } from '../utils/freqTranslation';
import { detectPitch } from '../utils/detectPitch';
import logo from '../../assets/logo.png';
import fretKey from '../../assets/key.png';
import fret24 from '../../assets/24_fret.png';
import './App.css';


const context = new window.AudioContext;
const analyser = new AnalyserNode(context, { fftSize: 2048 });

const App = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [recordingStarted, setRecordingStarted] = useState<boolean>(false);
  const [shift, setShift] = useState<boolean>(false);
  const [input, setInput] = useState<string[]>([]);
  const [output, setOutput] = useState<string>('');

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
      if (fundamentalFreq > 59.91 && fundamentalFreq < 1207.63) {
        const newBatch = batch.slice();
        const char = translateFreq(shift, fundamentalFreq);
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
      } else if (char === 'delete') {
        newinput.pop();
        setInput(newinput);
      } else if (char === 'return') {
        setRecording(false);
      } else {
        newinput.push(char);
        setInput(newinput);
      }
    }
  }

  return (
    <div>
      <div>
        <div className="logo" >
          <img src={logo} width="205" height="63" alt="Logo" />
        </div>
        <div className="buttons">
          <button
            className={recording ? "recording" : "record"}
            onClick={() => {
              setRecording(true);
              setRecordingStarted(true);
            }}
          >
            {recording ? "Recording!" : "Start Recording"}
          </button>
          <button
            className="clear-record"
            onClick={clearRecording}
            disabled={!recording && output ? false : true}
          >
            Clear Recording
          </button>
        </div>
        <div className="workspace">
          <div>
            <span className="input-label">Input</span>
            <span className="shift">{shift ? <div>SHIFT ON</div> : <></>}</span>
            <div className="input">{input.join('')}</div>
          </div>
          <div>
            <span className="output-label">Output</span>
            <div className="output">{output}</div>
          </div>
        </div>
        <div className="frets">
          <img className="fret-key" src={fretKey} alt="Fret Key" />
          <img src={fret24} width="100%" alt="24 Fret Map" />
        </div>
      </div>
    </div>
  );
}

export default App;
