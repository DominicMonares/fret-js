import React from 'react';
import ReactDOM from 'react-dom';
import notes from '../../notes.js';
import logo from '../assets/logo.png';

const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext;
const analyser = new AnalyserNode(context, { fftSize: 2048 });
const notesArray = notes;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: true,
      recording: <></>,
      start: false,
      shift: false,
      shifted: <></>,
      frameId: null,
      currentNode: [],
      output: [],
      func: '',
      clearRecording: <></>
    };
    this.findFundamentalFreq = this.findFundamentalFreq.bind(this);
    this.record = this.record.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.clearRecording = this.clearRecording.bind(this);
  }

  getGuitar() {
    return navigator.mediaDevices.getUserMedia({ audio: { latency: 0 } });
  }

  async setupContext() {
    if (context.state === 'suspended') { await context.resume() }

    const guitar = await this.getGuitar(); // media stream
    const source = context.createMediaStreamSource(guitar); // media stream audio source node
    source
      .connect(analyser)
      .connect(context.destination);
  }

  findFundamentalFreq(buffer, sampleRate) {
    let n = 1024, bestR = 0, bestK = -1;
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

      if (r > 0.9) { break }
    }

    if (bestR > 0.0025) {
      return sampleRate / bestK;
    } else {
      return -1;
    }
  }

  findClosestNote(freq, notes) {
    let low = -1, high = notes.length;
    while (high - low > 1) {
      let pivot = Math.round((low + high) / 2);
      notes[pivot].frequency <= freq ? low = pivot : high = pivot;
    }

    if (Math.abs(notes[high].frequency - freq) <= Math.abs(notes[low].frequency - freq)) {
      return [notes[high], high];
    }

    return [notes[low], low];
  }

  removeOvertones(notes) {
    console.log('NOTES ', notes);
    let noteNode = [null, 0];
    for (let i = 0; i < notes.length - 1; i++) {
      if (notes[i][1] > noteNode[1]) {
        noteNode = [notes[i][0], notes[i][1]];
      }
    }

    return noteNode[0];
  }

  noteWithinRange(index) {
    if (index >= 25 && index <= 76) {
      return true;
    } else {
      return false;
    }
  }

  async translateFreq(freq) {
    await this.setState({ start: true })
    let noteNode = this.findClosestNote(freq, notesArray);
    let note = noteNode[0];
    let noteIndex = noteNode[1];
    if (this.noteWithinRange(noteIndex)) {
      let newCurrentNode = this.state.currentNode.slice();
      let noteKey;
      !this.state.shift ? noteKey = note['keys'][0] : noteKey = note['keys'][1];
      newCurrentNode.push([noteKey, noteIndex]);
      console.log('CURRENT NODE ', noteNode);
      this.setState({ currentNode: newCurrentNode });
    }
  }

  async saveNote() {
    let newOutput = this.state.output.slice();
    let newNote = this.removeOvertones(this.state.currentNode.slice());
    if (newNote !== '') {
      if (newNote === 'shift') {
        if (!this.state.shift) {
          await this.setState({ start: false, shift: true, shifted: <div>SHIFT ON</div>, currentNode: [], output: newOutput });
        } else {
          await this.setState({ start: false, shift: false, shifted: <></>, currentNode: [], output: newOutput });
        }
      } else if (newNote === 'delete') {
        let deleted = newOutput.pop();
        await this.setState({ start: false, currentNode: [], output: newOutput });
        console.log(`${deleted} DELETED`);
      } else if (newNote === 'return') {
        await this.stopRecording();
      } else {
        newOutput.push(newNote);
        await this.setState({ start: false, currentNode: [], output: newOutput });
        console.log('OUTPUT ', this.state.output);
      }
    }
  }

  async record(e) {
    if (this.state.record) {
      // detects pitch
      let buffer = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(buffer);
      let fundamentalFreq = this.findFundamentalFreq(buffer, context.sampleRate);
      if (fundamentalFreq !== -1) {
        await this.translateFreq(fundamentalFreq);
      } else if (this.state.start) {
        this.saveNote();
      }

      await this.setState({ recording: <div>Recording in progress!</div>, frameId: window.requestAnimationFrame(this.record.bind(this)) });
    } else {
      await this.setState({ record: true });
    }
  }

  async stopRecording(e) {
    await this.setState({ record: false, recording: <></> });
    var newOutput = this.state.output.join('');
    var newFunc;

    try {
      newFunc = eval(newOutput); // Never use eval on an app that needs security!
    } catch (err) {
      if (err instanceof SyntaxError) {
        newFunc = 'ERROR';
      }
    }

    await this.setState({
      func: newFunc,
      clearRecording: <button onClick={this.clearRecording}>Clear Recording</button>
    });
  }

  async clearRecording(e) {
    this.setState({
      record: false,
      recording: <></>,
      start: false,
      shift: false,
      frameId: null,
      currentNode: [],
      output: [],
      func: ''
    })
  }

  componentDidMount() {
    navigator.getUserMedia({ audio: true }, this.setupContext.bind(this), () => { console.log('CONTEXT SETUP FAILED') });
  }

  render() {
    return (
      <div>
        <img src={logo} alt="Logo"/>
        <div>
          <button onClick={this.record}>Start Recording</button>
          <button onClick={this.stopRecording}>Stop Recording</button>
          {this.state.clearRecording}
        </div>
        <div>
          {this.state.recording}
          {this.state.shifted}
        </div>
        <div className="func">
          <p>{this.state.output.join('')}</p>
          <p>{this.state.func}</p>
        </div>
      </div>
    )
  }
}

export default App;
