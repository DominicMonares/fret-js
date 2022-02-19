import React from 'react';
import ReactDOM from 'react-dom';
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
      record: true,
      start: false,
      currentNode: [],
      output: []
    };
    this.findFundamentalFreq = this.findFundamentalFreq.bind(this);
    this.record = this.record.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
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

  noteTally(notes) {
    var tally = {};
    for (var i = 0; i < notes.length - 1; i++) {
      if (!tally[notes[i]]) {
        tally[notes[i]] = 1;
      } else {
        tally[notes[i]] ++;
      }
    }

    var note = ['', 0];
    for (var n in tally) {
      if (tally[n] > note[1]) {
        note = [n, tally[n]];
      }
    }

    return note[0];
  }

  async record(e) {
    if (this.state.record) {
      // detect pitch
      var buffer = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(buffer);
      var fundamentalFreq = this.findFundamentalFreq(buffer, context.sampleRate);
      if (fundamentalFreq !== -1) {
        await this.setState({start: true})
        var note = this.findClosestNote(fundamentalFreq, notesArray);
        if (note.note !== 'F#8') {
          var newCurrentNode = this.state.currentNode.slice();
          newCurrentNode.push(note.note);
          await this.setState({ currentNode: newCurrentNode });
        }
      } else if (this.state.start) {
        var newOutput = this.state.output.slice();
        var newNote = this.noteTally(this.state.currentNode.slice());
        if (newNote !== '') {
          newOutput.push(newNote);
          await this.setState({ start: false, currentNode: [], output: newOutput });
          console.log('OUTPUT ', this.state.output);
        }
      }

      frameId = window.requestAnimationFrame(this.record.bind(this));
    } else {
      await this.setState({record: true});
    }
  }

  stopRecording(e) {
    this.setState({record: false});
  }

  componentDidMount() {
    navigator.getUserMedia({audio: true}, this.setupContext.bind(this), () => {console.log('CONTEXT SETUP FAILED')});
  }

  render() {
    return (
      <div>
        <h1>fretJs</h1>
        <button onClick={this.record}>Start Recording</button>
        <button onClick={this.stopRecording}>Stop Recording</button>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
