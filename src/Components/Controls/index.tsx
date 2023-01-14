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
    <div className="buttons">
      <button
        className="fretNum"
        onClick={() => setFretNum(fretNum === 22 ? 24 : 22)}
      >
        {fretNum === 22 ? "Switch to 24 Frets" : "Switch to 22 Frets"}
      </button>
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
  );
}

export default Controls;
