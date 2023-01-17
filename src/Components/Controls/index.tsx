import { useEffect, useState } from "react";
import { context, distortion, gain } from "../../utils/audio";
import makeDistortionCurve from "../../utils/makeDistortionCurve";
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
  const [distorted, setDistorted] = useState<boolean>(false);

  useEffect(() => {
    const sampleRate = context.sampleRate;
    if (distorted) {
      distortion.curve = makeDistortionCurve(500, sampleRate);
      gain.gain.value = 0.05;
    } else {
      distortion.curve = makeDistortionCurve(0, sampleRate);
      gain.gain.value = 1;
    }
  }, [distorted]);

  return (
    <div className="controls">
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
      <div className="option-container">
        <button
          className={distorted ? "distorted" : ""}
          onClick={() => setDistorted(!distorted)}
        >
          {distorted ? "Remove Distortion" : "Add Distortion"}
        </button>
        <button onClick={() => setFretNum(fretNum === 22 ? 24 : 22)}>
          {fretNum === 22 ? "Switch to 24 Frets" : "Switch to 22 Frets"}
        </button>
      </div>
    </div>
  );
}

export default Controls;
