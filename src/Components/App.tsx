import React, { useEffect, useState } from 'react';
import { Notes } from '../types';
import notes from '../../notes.json';
import logo from '../../assets/logo.png';
import fretKey from '../../assets/key.png';
import fret24 from '../../assets/24_fret.png';
import './App.css';


const AudioContext = window.AudioContext;
const context = new AudioContext;
const analyser = new AnalyserNode(context, { fftSize: 2048 });
const notesArray = notes;

const App = () => {
  const [record, setRecord] = useState<boolean>(true);
  const [recording, setRecording] = useState<'record' | 'recording'>('record');
  const [start, setStart] = useState<boolean>(false);
  const [shift, setShift] = useState<boolean>(false);
  const [shifted, setShifted] = useState<JSX.Element>(<></>);
  const [frameId, setFrameId] = useState<number | null>(null);
  const [currentNode, setCurrentNode] = useState<any[]>([]); // TEMP ANY
  const [output, setOutput] = useState<any[]>([]); // TEMP ANY
  const [func, setFunc] = useState<string>('');

  useEffect(() => {
    navigator.getUserMedia(
      { audio: true },
      async () => await setupContext(),
      () => console.log('CONTEXT SETUP FAILED')
    );
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

  const findFundamentalFreq = (buffer: any, sampleRate: number) => { // TEMP ANY, MAKE TYPE
    const n = 1024
    let bestR = 0
    let bestK = -1;
    for (let k = 8; k <= 6000; k++) {
      let sum = 0;
      for (let i = 0; i < n; i++) {
        let signal1 = (buffer[i] - 127.5) / 127.5;
        let signal2 = (buffer[i + k] - 127.5) / 127.5;
        sum += signal1 * signal2;
      }

      let r = sum / n;
      if (r > bestR) {
        bestR = r;
        bestK = k;
      }

      if (r > 0.9) break;
    }


    if (bestR > 0.0025) {
      return sampleRate / bestK;
    } else {
      return -1;
    }
  }

  const findClosestNote = (freq: number, notes: any) => { // TEMP ANY, MAKE TYPE
    let low = -1
    let high = notes.length;
    while (high - low > 1) {
      let pivot = Math.round((low + high) / 2);
      notes[pivot].frequency <= freq ? low = pivot : high = pivot;
    }

    if (Math.abs(notes[high].frequency - freq) <= Math.abs(notes[low]?.frequency - freq)) {
      return [notes[high], high];
    }

    return [notes[low], low];
  }

  const removeOvertones = (notes: any): string | number | null => { // TEMP ANY, MAKE TYPE
    let noteNode = [null, 0];
    for (let i = 0; i < notes.length - 1; i++) {
      if (noteNode[1] && notes[i][1] > noteNode[1]) {
        noteNode = [notes[i][0], notes[i][1]];
      }
    }

    return noteNode[0];
  }

  const noteWithinRange = (index: number) => {
    if (index >= 25 && index <= 76) {
      return true;
    } else {
      return false;
    }
  }

  const translateFreq = (freq: any) => { // TEMP ANY
    console.log('FASDFASDXF ', start);
    setStart(true);
    console.log('ASDFDSAF ', start)
    const noteNode = findClosestNote(freq, notesArray);
    const note = noteNode[0];
    const noteIndex = noteNode[1];
    if (noteWithinRange(noteIndex)) {
      const newCurrentNode = currentNode.slice();
      let noteKey;
      !shift ? noteKey = note['keys'][0] : noteKey = note['keys'][1];
      newCurrentNode.push([noteKey, noteIndex]);
      console.log('CURRENT NODE ', noteNode);
      setCurrentNode(newCurrentNode);
    }
  }

  const startRecording = () => { // TEMP ANY
    if (record) {
      // detects pitch
      const buffer = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(buffer);
      const fundamentalFreq = findFundamentalFreq(buffer, context.sampleRate);
      console.log('START ', start)
      if (fundamentalFreq !== -1 && fundamentalFreq < 1337) { // 1337 is ceiling for E6
        translateFreq(fundamentalFreq);
      }

      if (start) {
        saveNote();
      }

      setRecording('recording');
      setFrameId(window.requestAnimationFrame(startRecording));
    } else {
      setRecord(true);
    }
  }

  const stopRecording = async () => { // TEMP ANY
    setRecord(false);
    setRecording('record');
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

  const saveNote = async () => {
    const newOutput = output.slice();
    const newNote = removeOvertones(currentNode.slice());
    console.log('SAVE NOTE CALLED ', newOutput, newNote)
    if (newNote !== '') {
      if (newNote === 'shift') {
        if (!shift) {
          setStart(false);
          setShift(true);
          setShifted(<div>SHIFT ON</div>);
          setCurrentNode([]);
          setOutput(newOutput);
        } else {
          setStart(false);
          setShift(false);
          setShifted(<></>);
          setCurrentNode([]);
          setOutput(newOutput);
        }
      } else if (newNote === 'delete') {
        const deleted = newOutput.pop();
        setStart(false);
        setCurrentNode([]);
        setOutput(newOutput);
        console.log(`${deleted} DELETED`);
      } else if (newNote === 'return') {
        await stopRecording();
      } else {
        newOutput.push(newNote);
        setStart(false);
        setCurrentNode([]);
        setOutput(newOutput);
        console.log('OUTPUT ', output);
      }
    }
  }

  const clearRecording = () => {
    console.log('CLEAR RECORDING CALLED');
    setRecord(false);
    setRecording('record');
    setStart(false);
    setShift(false);
    setShifted(<></>);
    setFrameId(null);
    setCurrentNode([]);
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
          <button className={recording} onClick={startRecording}>{
            recording === 'record' ? 'Start Recording' : 'Recording!'
          }</button>
          <button className="stop-record" onClick={stopRecording}>Stop Recording</button>
          <button className="clear-record" onClick={clearRecording}>Clear Recording</button>
        </div>
        <div className="workspace">
          <div>
            <span className="input-label">Input</span>
            <span className="shift">{shifted}</span>
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
