import { translateFreq, removeExtraChars } from '../src/utils/freqTranslation';
import notes from '../notes.json';

describe('translateFreq', () => {
  it('should return a lowercase "a" when freq 73.42 is provided and not shifted', () => {
    const result = translateFreq(false, 73.42);
    expect(result).toBe('a');
  });

  it('should return an uppercase "T" when freq 220 is provided and shifted', () => {
    const result = translateFreq(true, 220);
    expect(result).toBe('T');
  });

  it('should return a space when freq 61.74 is provided and unshifted', () => {
    const result = translateFreq(false, 61.74);
    expect(result).toBe(' ');
  });
});

describe('removeExtraChars', () => {
  it('should return char "F" if it is most common in batch', () => {
    const batch = ['G', 'F', 'F', 'F', 'F', 'F', 'G', 'G']
    const result = removeExtraChars(batch);
    expect(result).toBe('F');
  });

  it('should return first char in order if 2 chars appear same number of times', () => {
    const batch = ['b', 'a', 'b', 'b', 'a', 'a', 'b', 'b', 'a', 'a'];
    const result = removeExtraChars(batch);
    expect(result).toBe('a');
  });
});
