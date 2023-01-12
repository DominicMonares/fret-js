import { FretProps } from "../../types";
import { useEffect, useState } from 'react';

import diagram22 from '../../../data/diagram22.json';
import diagram24 from '../../../data/diagram24.json';
import { Diagram } from "../../types";

const Fretboard = ({ fretNum, shift }: FretProps) => {
  const [diagram, setDiagram] = useState<Diagram>(fretNum === 22 ? diagram22 : diagram24);

  return (
    <div>
      {Object.values(diagram).map(guitarString => {
        return (
          <div>
            {guitarString.map(s => { })}
          </div>
        )
      })}
    </div>
  );
}

export default Fretboard;
