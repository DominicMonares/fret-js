import { useEffect, useState } from 'react';

import diagram22 from '../../../data/diagram22.json';
import diagram24 from '../../../data/diagram24.json';
import { Diagram, DiagramProps } from "../../types";
import './Diagram.css';

const Diagram = ({ fretNum, shift }: DiagramProps) => {
  const [diagram, setDiagram] = useState<Diagram>(fretNum === 22 ? diagram22 : diagram24);

  useEffect(() => {
    fretNum === 22 ? setDiagram(diagram22) : setDiagram(diagram24);
  });

  return (
    <div className="fb-diagram-container">
      <div className="fb-tune">
        {Object.keys(diagram).map(n => {
          return (
            <span className="fb-tune-note" key={n}>{n}</span>
          );
        })}
      </div>
      <div className="fb-container">
        <div className="fretboard">
          {Object.values(diagram).flat().map((f, i) => {
            return (
              <div
                className={
                  `fret
                  ${f.main ? 'main' : 'secondary'}
                  ${f.chars[0] === '' ? 'blank' : ''}`
                }
                key={i}
              >
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
              <span className="fret-num" key={n}>{n}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Diagram;
