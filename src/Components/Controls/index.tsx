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
      <button
        className={recording ? "active" : "inactive"}
        onClick={() => {
          setRecording(true);
          setRecordingStarted(true);
        }}
      >
        {recording ? "Recording!" : "Start Recording"}
      </button>
      <button
        className="inactive"
        onClick={clearRecording}
        disabled={!recording && output ? false : true}
      >
        Clear Recording
      </button>
      <button
        className="inactive"
        onClick={() => setFretNum(fretNum === 22 ? 24 : 22)}
      >
        {fretNum === 22 ? "Switch to 24 Frets" : "Switch to 22 Frets"}
      </button>
    </div>
  );
}

export default Controls;
