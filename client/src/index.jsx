import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import notes from '../../notes.js';

const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext;
const analyser = new AnalyserNode(context, {fftSize: 2048});
var source, guitar, frameId, fData;
var notesArray = notes;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNode: [],
      output: []
    };
    this.findFundamentalFreq = this.findFundamentalFreq.bind(this);
  }

  async setupContext() { // stream received
    const guitar = await this.getGuitar(); // media stream
    if (context.state === 'suspended') {
      await context.resume();
    }

    const source = context.createMediaStreamSource(guitar); // media stream audio source node
    source
      .connect(analyser)
      .connect(context.destination);
  }

  getGuitar() {
    return navigator.mediaDevices.getUserMedia({
      audio: {latency: 0}
    })
  }

  findFundamentalFreq(buffer, sampleRate) {
    var n = 1024, bestR = 0, bestK = -1;
    for (var k = 8; k <= 6000; k++) {
      var sum = 0;
      for (var i = 0; i < n; i++) {
        sum += ((buffer[i] - 127.5) / 127.5) * ((buffer[i + k] - 127.5) / 127.5);
      }

      var r = sum / n;
      if (r > bestR) {
        bestR = r;
        bestK = k;
      }

      if (r > 0.9) {
        break;
      }
    }

    if (bestR > 0.0025) {
      var fundamentalFreq = sampleRate / bestK;
      return fundamentalFreq;
    } else {
      return -1;
    }
  }

  detectPitch() {
    var buffer = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(buffer);
    var fundamentalFreq = this.findFundamentalFreq(buffer, context.sampleRate);
    if (fundamentalFreq !== -1) {
      var note = this.findClosestNote(fundamentalFreq, notesArray);
      console.log('NOTE ', note);
    } else {
      var newOutput = this.state.output.slice();
      newOutput.push(this.state.currentNode);
      this.setState({currentNode: [], output: newOutput});
    }

    frameId = window.requestAnimationFrame(this.detectPitch.bind(this));
  }

  findClosestNote(freq, notes) {
    var low = -1, high = notes.length;
    while (high - low > 1) {
      var pivot = Math.round((low + high) / 2);
      if (notes[pivot].frequency <= freq) {
        low = pivot;
      } else {
        high = pivot;
      }
    }

    if (Math.abs(notes[high].frequency - freq) <= Math.abs(notes[low].frequency - freq)) {
      return notes[high];
    }

    return notes[low];
  }

  componentDidMount() {
    navigator.getUserMedia({audio: true}, this.setupContext.bind(this), (err) => {console.log(err)});
    this.detectPitch();
  }

  render() {
    return (
      <div>
        <h1>guitarJs</h1>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
