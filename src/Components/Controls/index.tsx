import { ControlsProps } from "../../types";
import './Controls.css';


const Controls = ({
  recording,
  output,
  fretNum,
  setFretNum,
  setRecording,
  setRecordingStarted,
  clearRecording
}: ControlsProps) => {
  return (
    <div className="controls-container">
      <div className="logo">
        <span className="fret-logo">fret</span>
        <span className="js-logo">JS</span>
      </div>
      <div className="record-container">
        <button
          className={recording ? "recording" : ""}
          onClick={() => {
            setRecording(true);
            setRecordingStarted(true);
          }}
        >
          {recording ? "Recording!" : "Start Recording"}
        </button>
        <button
          onClick={clearRecording}
          disabled={!recording && output ? false : true}
        >
          Clear Recording
        </button>
      </div>
      <button onClick={() => setFretNum(fretNum === 22 ? 24 : 22)}>
        {fretNum === 22 ? "Switch to 24 Frets" : "Switch to 22 Frets"}
      </button>
    </div>
  );
}

export default Controls;
