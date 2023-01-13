import { FretProps } from "../../types";
import { useEffect, useState } from 'react';

import diagram22 from '../../../data/diagram22.json';
import diagram24 from '../../../data/diagram24.json';
import { Diagram } from "../../types";
import './Fretboard.css';

const Fretboard = ({ fretNum, shift }: FretProps) => {
  const [diagram, setDiagram] = useState<Diagram>(fretNum === 22 ? diagram22 : diagram24);

  useEffect(() => {
    fretNum === 22 ? setDiagram(diagram22) : setDiagram(diagram24);
  });

  return (
    <div className="fb-diagram-container">
      <div className="fb-tune">
        {Object.keys(diagram).map(n => {
          return (
            <span className="fb-tune-note">{n}</span>
          );
        })}
      </div>
      <div className="fb-container">
        <div className="fretboard">
          {Object.values(diagram).flat().map(f => {
            return (
              <div className="fret">
                <span className="string"></span>
                <span className="char">
                  {shift ? f.chars[1] : f.chars[0]}
                </span>
                <span className="string"></span>
              </div>
            );
          })}
        </div>
        <div className="fret-nums">
          {Array.from({ length: 25 }, (v, i) => i).map(n => {
            return (
              <span className="fret-num">{n}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Fretboard;
