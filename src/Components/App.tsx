import React, { useEffect, useState } from 'react';

import { Notes } from '../types';
import {
  findFundamentalFreq,
  removeOvertones,
  translateFreq
} from '../utils';
import './App.css';

import logo from '../../assets/logo.png';
import fretKey from '../../assets/key.png';
import fret24 from '../../assets/24_fret.png';


const AudioContext = window.AudioContext;
const context = new AudioContext;
const analyser = new AnalyserNode(context, { fftSize: 2048 });

const App = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [recordingStarted, setRecordingStarted] = useState<boolean>(false);
  const [shift, setShift] = useState<boolean>(false);
  const [output, setOutput] = useState<any[]>([]); // TEMP ANY
  const [func, setFunc] = useState<string>('');

  useEffect(() => {
    navigator.getUserMedia(
      { audio: true },
      async () => await setupContext(),
      () => console.log('CONTEXT SETUP FAILED')
    );
  }, []);

  useEffect(() => {
    if (recording) {
      startRecording([]);
    } else if (!recording && recordingStarted) {
      stopRecording();
      setRecordingStarted(false);
    }
  }, [recording, shift, output]);

  const setupContext = async () => {
    if (context.state === 'suspended') await context.resume();
    const guitar = await navigator.mediaDevices.getUserMedia({ audio: { latency: 0 } });
    const source = context.createMediaStreamSource(guitar); // media stream audio source
    source
      .connect(analyser)
      .connect(context.destination);
  }

  const saveNote = async (note: any) => { // TEMP ANY
    const newOutput = output.slice();
    if (note !== '') {
      if (note === 'shift') {
        setShift(prev => !prev);
      } else if (note === 'delete') {
        const deleted = newOutput.pop();
        setOutput(newOutput);
        console.log(`${deleted} DELETED`);
      } else if (note === 'return') {
        await stopRecording();
      } else {
        newOutput.push(note);
        setOutput(newOutput);
        console.log('OUTPUT 1 ', newOutput);
      }
    }
  }

  const startRecording = async (batch: any[]) => { // TEMP ANY
    if (recording) {
      // Detects pitch
      const buffer = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(buffer);
      const fundamentalFreq = findFundamentalFreq(buffer, context.sampleRate);
      if (fundamentalFreq > 69 && fundamentalFreq < 1337) { // 69 is floor for C#2 and 1337 is ceiling for E6
        const newBatch = translateFreq(shift, fundamentalFreq, batch);
        window.requestAnimationFrame(() => startRecording(newBatch));
      } else if (fundamentalFreq === -1) {
        if (batch.length) saveNote(removeOvertones(batch));
        window.requestAnimationFrame(() => startRecording([]));
      } else {
        window.requestAnimationFrame(() => startRecording(batch));
      }
    }
  }

  const stopRecording = async () => { // TEMP ANY
    console.log('STOP RECORDING CALLED')
    setRecording(false);
    const newOutput = output.join('');
    let newFunc;

    try {
      newFunc = eval('(' + newOutput + ')'); // Never use eval on an app that needs security!
    } catch (err) {
      if (err instanceof SyntaxError) {
        newFunc = 'ERROR ' + newOutput;
      }
    }

    setFunc(newFunc);
  }

  const clearRecording = () => {
    console.log('CLEAR RECORDING CALLED');
    setRecording(false);
    setShift(false);
    setOutput([]);
    setFunc('');
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
            className="stop-record"
            onClick={() => setRecording(false)}
          >
            Stop Recording
          </button>
          <button className="clear-record" onClick={clearRecording}>Clear Recording</button>
        </div>
        <div className="workspace">
          <div>
            <span className="input-label">Input</span>
            <span className="shift">{shift ? <div>SHIFT ON</div> : <></>}</span>
            <div className="input func">{output.join('')}</div>
          </div>
          <div>
            <span className="output-label">Output</span>
            <div className="output func">{func}</div>
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
