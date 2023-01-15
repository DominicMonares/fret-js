import { useEffect, useState } from 'react';
import Fretboard from './Fretboard';
import { Diagram, DiagramProps } from "../../types";
import diagram22 from '../../../data/diagram22.json';
import diagram24 from '../../../data/diagram24.json';
import './Diagram.css';


const Diagram = ({ fretNum, shift }: DiagramProps) => {
  const [diagram, setDiagram] = useState<Diagram>(fretNum === 22 ? diagram22 : diagram24);

  useEffect(() => {
    fretNum === 22 ? setDiagram(diagram22) : setDiagram(diagram24);
  });

  return (
    <div className="diagram">
      <div className="diagram-tune">
        {Object.keys(diagram).map(n => <span className="diagram-tune-note" key={n}>{n}</span>)}
      </div>
      <div className="fretboard-container">
        <Fretboard shift={shift} diagram={diagram} />
        <div className="fret-nums">
          {Array.from({ length: 25 }, (v, i) => i).map(n => {
            return <span className="fret-num" key={n}>{n}</span>;
          })}
        </div>
      </div>
    </div>
  );
}

export default Diagram;
