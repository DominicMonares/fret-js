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
    <div className="fretboard-container">
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
    </div>
  );
}

export default Fretboard;
