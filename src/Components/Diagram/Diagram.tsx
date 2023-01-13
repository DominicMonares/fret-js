import { useEffect, useState } from 'react';

import Fretboard from './Fretboard';
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
        <Fretboard shift={shift} diagram={diagram} />
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
