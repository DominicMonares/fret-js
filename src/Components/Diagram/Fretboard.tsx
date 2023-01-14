import { FretboardProps } from '../../types';
import './Diagram.css';

const Fretboard = ({ shift, diagram }: FretboardProps) => {
  return (
    <div className="fretboard">
      {Object.values(diagram).flat().map((f, i) => {
        return (
          <div
            className={`fret ${f.chars[0] === '' ? 'blank' : f.main ? 'main' : 'secondary'}`}
            key={i}
          >
            <span className="char">
              {shift ? f.chars[1] : f.chars[0]}
            </span>
            <span className="string"></span>
          </div>
        );
      })}
    </div>
  );
}

export default Fretboard;
