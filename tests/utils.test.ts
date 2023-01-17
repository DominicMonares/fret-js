import { translateFreq, removeExtraChars } from '../src/utils/freqTranslation';
import detectPitch from '../src/utils/detectPitch';
import buffer from './bufferTestData.json';


describe('detectPitch', () => {
  it('should return a freq around 330 when matching buffer applied', () => {
    const floatArr = new Float32Array(buffer.freq330);
    const result = detectPitch(floatArr, 44100);
    expect(result).toBe(330.1346798637547);
  });

  it('should return -1 if frequency is too low', () => {
    const floatArr = new Float32Array(buffer.noFreq);
    const result = detectPitch(floatArr, 44100);
    expect(result).toBe(-1);
  });
});

describe('translateFreq', () => {
  it('should return a lowercase "a" when freq 73.42 is provided and not shifted on 22 fret', () => {
    const result = translateFreq(false, 73.42, 22);
    expect(result).toBe('a');
  });

  it('should return an uppercase "R" when freq 220 is provided and shifted', () => {
    const result = translateFreq(true, 220, 24);
    expect(result).toBe('R');
  });

  it('should return a space when freq 61.74 is provided and unshifted', () => {
    const result = translateFreq(false, 61.74, 22);
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
