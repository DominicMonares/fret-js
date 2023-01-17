import { useEffect, useState } from 'react';
import Controls from './Controls';
import Workspace from './Workspace';
import Diagram from './Diagram';
import { analyser, context, setupContext } from '../utils/audio';
import { removeExtraChars, translateFreq } from '../utils/freqTranslation';
import detectPitch from '../utils/detectPitch';
import { FretNum } from '../types';
import './App.css';


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
      // Never use eval on an app that needs security!
      // This line is the reason why this app cannot be deployed
      newOutput = eval(`(${input.join('')})`);
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
      <div className="top-container">
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
      </div>
      <Diagram fretNum={fretNum} shift={shift} />
    </div>
  );
}

export default App;
