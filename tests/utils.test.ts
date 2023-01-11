import { translateFreq } from '../src/utils/freqTranslation';
import notes from '../notes.json';

describe('translateFreq', () => {
  it('should return a lowercase "a" when freq 73.42 is provided and not shifted', () => {
    const result = translateFreq(false, 73.42);
    expect(result).toBe('a');
  });
});
