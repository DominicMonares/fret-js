import { useEffect, useState } from 'react';
import { InputProps } from '../../types';
import './Workspace.css';


const Input = ({ line }: InputProps) => {
  const [spaceCount, setSpaceCount] = useState<number>(0);
  const [newlineSpaces, setNewlineSpaces] = useState<string>('');

  useEffect(() => {
    let count = 0;
    for (const char of line) {
      if (char === ' ') {
        count++
      } else {
        break;
      }
    }

    let spaces = '';
    while (spaces.length < count) spaces += '•';
    setSpaceCount(count);
    setNewlineSpaces(spaces);
  });

  return (
    <>
      <span className="nl-spaces">{newlineSpaces}</span>
      <span>{line.slice(spaceCount)}</span>
    </>
  );
}

export default Input;
