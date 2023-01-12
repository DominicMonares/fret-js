import { FretProps } from "../../types";
import { useEffect, useState } from 'react';

import diagram22 from '../../../data/diagram22.json';
import diagram24 from '../../../data/diagram24.json';
import { Diagram } from "../../types";

const Fretboard = ({ fretNum, shift }: FretProps) => {
  const [diagram, setDiagram] = useState<Diagram>(fretNum === 22 ? diagram22 : diagram24);

  return (
    <div className="fretboard">
      {Object.values(diagram).flat().map(f => {
        return (
          <div>{shift ? f.chars[0] : f.chars[1]}</div>
        );
      })}
    </div>
  );
}

export default Fretboard;
