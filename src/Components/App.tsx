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
  const [recording, setRecording] = useState<boolean>(true);
  const [recordingClass, setRecordingClass] = useState<'record' | 'recording'>('record');
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
    // handle state updates here
  });

  const getGuitar = () => {
    return navigator.mediaDevices.getUserMedia({ audio: { latency: 0 } }); // Make note here
  }

  const setupContext = async () => {
    if (context.state === 'suspended') await context.resume();
    const guitar = await getGuitar(); // media stream
    const source = context.createMediaStreamSource(guitar); // media stream audio source node
    source
      .connect(analyser)
      .connect(context.destination);
  }

  const saveNote = async (note: any) => { // TEMP ANY
    const newOutput = output.slice();
    console.log('SAVE NOTE CALLED ', newOutput, note)
    if (note !== '') {
      if (note === 'shift') {
        if (!shift) {
          setShift(true);
          setOutput(() => newOutput);
        } else {
          setShift(false);
          setOutput(() => newOutput);
        }
      } else if (note === 'delete') {
        const deleted = newOutput.pop();
        setOutput(newOutput);
        console.log(`${deleted} DELETED`);
      } else if (note === 'return') {
        await stopRecording();
      } else {
        newOutput.push(note);
        setOutput(newOutput);
        console.log('OUTPUT ', output);
      }
    }
  }

  const startRecording = async (batch: any[]) => { // TEMP ANY
    if (recording) {
      // Detects pitch
      const buffer = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(buffer);
      const fundamentalFreq = findFundamentalFreq(buffer, context.sampleRate);
      if (fundamentalFreq < 1337) { // 1337 is ceiling for E6
        if (fundamentalFreq === -1 && batch.length) {
          console.log('ASDF ', batch, removeOvertones(batch))
          const note = removeOvertones(batch);
          saveNote(note);
          // Update state and use second useEffect
          window.requestAnimationFrame(() => startRecording([]));
        } else {
          const newBatch = translateFreq(shift, fundamentalFreq, batch);
          window.requestAnimationFrame(() => startRecording(newBatch));
        }
      }
    }
  }

  const stopRecording = async () => { // TEMP ANY
    setRecording(false);
    setRecordingClass('record');
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
    setRecordingClass('record');
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
          <button className={recordingClass} onClick={() => {
            setRecording(true);
            setRecordingClass('recording');
            startRecording([]);
          }}>{
            recordingClass === 'record' ? 'Start Recording' : 'Recording!'
          }</button>
          <button className="stop-record" onClick={stopRecording}>Stop Recording</button>
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
