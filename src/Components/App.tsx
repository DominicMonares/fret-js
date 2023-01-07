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


const context = new window.AudioContext;
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
      () => console.error('Context setup failed')
    );
  }, []);

  useEffect(() => {
    if (recording) {
      startRecording([]);
    } else if (!recording && recordingStarted) {
      setRecordingStarted(false);
      stopRecording();
    }
  });

  const setupContext = async () => {
    if (context.state === 'suspended') await context.resume();
    const guitar = await navigator.mediaDevices.getUserMedia({ audio: { latency: 0 } });
    const source = context.createMediaStreamSource(guitar); // media stream audio source
    source.connect(analyser).connect(context.destination);
  }

  const saveNote = (note: any) => { // TEMP ANY
    const newOutput = output.slice();
    if (note !== '') {
      if (note === 'shift') {
        setShift(prev => !prev);
      } else if (note === 'delete') {
        newOutput.pop();
        setOutput(newOutput);
      } else if (note === 'return') {
        setRecording(false);
      } else {
        newOutput.push(note);
        setOutput(newOutput);
      }
    }
  }

  const startRecording = (batch: any[], deadSignal?: number) => { // TEMP ANY
    if (recording) {
      // Detects pitch
      const buffer = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(buffer);
      const fundamentalFreq = findFundamentalFreq(buffer, context.sampleRate);
      console.log('FREQ  ', fundamentalFreq)
      // 59 is floor for B1 and 1191 is ceiling for D6
      if (fundamentalFreq > 59 && fundamentalFreq < 1191) {
        const newBatch = batch.slice();
        newBatch.push([translateFreq(shift, fundamentalFreq), fundamentalFreq]);
        window.requestAnimationFrame(() => startRecording(newBatch));
      } else if (fundamentalFreq === -1) {
        // Prevent straggler frequencies
        !deadSignal ? deadSignal = 1 : deadSignal++;

        if (batch.length && deadSignal === 2) {
          saveNote(removeOvertones(batch));
        } else if (batch.length && deadSignal < 2) {
          window.requestAnimationFrame(() => startRecording(batch, deadSignal));
        } else {
          window.requestAnimationFrame(() => startRecording([]));
        }
      } else {
        window.requestAnimationFrame(() => startRecording(batch));
      }
    }
  }

  const stopRecording = () => { // TEMP ANY
    context.suspend();
    const newOutput = output.join('');
    let newFunc;

    try {
      newFunc = eval('(' + newOutput + ')'); // Never use eval on an app that needs security!
    } catch (err: any) { // TEMP ANY
      newFunc = err.toString();
    }

    setFunc(newFunc);
  }

  const clearRecording = () => {
    setRecording(false);
    setRecordingStarted(false);
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
