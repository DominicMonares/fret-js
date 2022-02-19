const notes = [
  {
    note: 'C0',
    frequency: 16.35
  },
  {
    note: 'C#0',
    frequency: 17.32
  },
  {
    note: 'D0',
    frequency: 18.35
  },
  {
    note: 'D#0',
    frequency: 19.45
  },
  {
    note: 'E0',
    frequency: 20.6
  },
  {
    note: 'F0',
    frequency: 21.83
  },
  {
    note: 'F#0',
    frequency: 23.12
  },
  {
    note: 'G0',
    frequency: 24.5
  },
  {
    note: 'G#0',
    frequency: 25.96
  },
  {
    note: 'A0',
    frequency: 27.5
  },
  {
    note: 'A#0',
    frequency: 29.14
  },
  {
    note: 'B0',
    frequency: 30.87
  },
  {
    note: 'C1',
    frequency: 32.7
  },
  {
    note: 'C#1',
    frequency: 34.65
  },
  {
    note: 'D1',
    frequency: 36.71
  },
  {
    note: 'D#1',
    frequency: 38.89
  },
  {
    note: 'E1',
    frequency: 41.2
  },
  {
    note: 'F1',
    frequency: 43.65
  },
  {
    note: 'F#1',
    frequency: 46.25
  },
  {
    note: 'G1',
    frequency: 49
  },
  {
    note: 'G#1',
    frequency: 51.91
  },
  {
    note: 'A1',
    frequency: 55
  },
  {
    note: 'A#1',
    frequency: 58.27
  },

  /////////////////////////////////
  // ONLY USED FOR 22 FRET GUITARS
  // MUST BE MANUALLY MODIFIED
  /////////////////////////////////

  {
    note: 'B1',
    frequency: 61.74
  },
  {
    note: 'C2',
    frequency: 65.41
  },

  /////////////////////////////////
  // BEGIN GUITAR RANGE
  /////////////////////////////////

  {
    note: 'C#2',
    frequency: 69.3,
    keys: [' ', ' ']
  },
  {
    note: 'D2',
    frequency: 73.42,
    keys: ['\n', '\n']
  },
  {
    note: 'D#2',
    frequency: 77.78,
    keys: ['shift', 'shift']
  },
  {
    note: 'E2',
    frequency: 82.41,
    keys: ['a', 'A']
  },
  {
    note: 'F2',
    frequency: 87.31,
    keys: ['b', 'B']
  },
  {
    note: 'F#2',
    frequency: 92.5,
    keys: ['c', 'C']
  },
  {
    note: 'G2',
    frequency: 98,
    keys: ['d', 'D']
  },
  {
    note: 'G#2',
    frequency: 103.83,
    keys: ['e', 'E']
  },
  {
    note: 'A2',
    frequency: 110,
    keys: ['f', 'F']
  },
  {
    note: 'A#2',
    frequency: 116.54,
    keys: ['g', 'G']
  },
  {
    note: 'B2',
    frequency: 123.47,
    keys: ['h', 'H']
  },
  {
    note: 'C3',
    frequency: 130.81,
    keys: ['i', 'I']
  },
  {
    note: 'C#3',
    frequency: 138.59,
    keys: ['j', 'J']
  },
  {
    note: 'D3',
    frequency: 146.83,
    keys: ['k', 'K']
  },
  {
    note: 'D#3',
    frequency: 155.56,
    keys: ['l', 'L']
  },
  {
    note: 'E3',
    frequency: 164.81,
    keys: ['m', 'M']
  },
  {
    note: 'F3',
    frequency: 174.61,
    keys: ['n', 'N']
  },
  {
    note: 'F#3',
    frequency: 185,
    keys: ['o', 'O']
  },
  {
    note: 'G3',
    frequency: 196,
    keys: ['p', 'P']
  },
  {
    note: 'G#3',
    frequency: 207.65,
    keys: ['q', 'Q']
  },
  {
    note: 'A3',
    frequency: 220,
    keys: ['r', 'R']
  },
  {
    note: 'A#3',
    frequency: 233.08,
    keys: ['s', 'S']
  },
  {
    note: 'B3',
    frequency: 246.94,
    keys: ['t', 'T']
  },
  {
    note: 'C4',
    frequency: 261.63,
    keys: ['u', 'U']
  },
  {
    note: 'C#4',
    frequency: 277.18,
    keys: ['v', 'V']
  },
  {
    note: 'D4',
    frequency: 293.66,
    keys: ['w', 'W']
  },
  {
    note: 'D#4',
    frequency: 311.13,
    keys: ['x', 'X']
  },
  {
    note: 'E4',
    frequency: 329.63,
    keys: ['y', 'Y']
  },
  {
    note: 'F4',
    frequency: 349.23,
    keys: ['z', 'Z']
  },
  {
    note: 'F#4',
    frequency: 369.99,
    keys: ['1', '!']
  },
  {
    note: 'G4',
    frequency: 392,
    keys: ['2', '@']
  },
  {
    note: 'G#4',
    frequency: 415.3,
    keys: ['3', '#']
  },
  {
    note: 'A4',
    frequency: 440,
    keys: ['4', '$']
  },
  {
    note: 'A#4',
    frequency: 466.16,
    keys: ['5', '%']
  },
  {
    note: 'B4',
    frequency: 493.88,
    keys: ['6', '^']
  },
  {
    note: 'C5',
    frequency: 523.25,
    keys: ['7', '&']
  },
  {
    note: 'C#5',
    frequency: 554.37,
    keys: ['8', '*']
  },
  {
    note: 'D5',
    frequency: 587.33,
    keys: ['9', '(']
  },
  {
    note: 'D#5',
    frequency: 622.25,
    keys: ['0', ')']
  },
  {
    note: 'E5',
    frequency: 659.25,
    keys: ['-', '_']
  },
  {
    note: 'F5',
    frequency: 698.46,
    keys: ['=', '+']
  },
  {
    note: 'F#5',
    frequency: 739.99,
    keys: ['[', '{']
  },
  {
    note: 'G5',
    frequency: 783.99,
    keys: [']', '}']
  },
  {
    note: 'G#5',
    frequency: 830.61,
    keys: ['\\', '|']
  },
  {
    note: 'A5',
    frequency: 880,
    keys: [';', ':']
  },
  {
    note: 'A#5',
    frequency: 932.33,
    keys: ["'", '"']
  },
  {
    note: 'B5',
    frequency: 987.77,
    keys: [',', '<']
  },
  {
    note: 'C6',
    frequency: 1046.5,
    keys: ['.', '>']
  },
  {
    note: 'C#6',
    frequency: 1108.73,
    keys: ['/', '?']
  },
  {
    note: 'D6',
    frequency: 1174.66,
    keys: ['`', '~']
  },
  {
    note: 'D#6',
    frequency: 1244.51,
    keys: ['delete', 'delete']
  },
  {
    note: 'E6',
    frequency: 1318.51,
    keys: ['return', 'return']
  },

  /////////////////////////////////
  // END GUITAR RANGE
  /////////////////////////////////

  {
    note: 'F6',
    frequency: 1396.91
  },
  {
    note: 'F#6',
    frequency: 1479.98
  },
  {
    note: 'G6',
    frequency: 1567.98
  },
  {
    note: 'G#6',
    frequency: 1661.22
  },
  {
    note: 'A6',
    frequency: 1760
  },
  {
    note: 'A#6',
    frequency: 1864.66
  },
  {
    note: 'B6',
    frequency: 1975.53
  },
  {
    note: 'C7',
    frequency: 2093
  },
  {
    note: 'C#7',
    frequency: 2217.46
  },
  {
    note: 'D7',
    frequency: 2349.32
  },
  {
    note: 'D#7',
    frequency: 2489.02
  },
  {
    note: 'E7',
    frequency: 2637.02
  },
  {
    note: 'F7',
    frequency: 2793.83
  },
  {
    note: 'F#7',
    frequency: 2959.96
  },
  {
    note: 'G7',
    frequency: 3135.96
  },
  {
    note: 'G#7',
    frequency: 3322.44
  },
  {
    note: 'A7',
    frequency: 3520
  },
  {
    note: 'A#7',
    frequency: 3729.31
  },
  {
    note: 'B7',
    frequency: 3951.07
  },
  {
    note: 'C8',
    frequency: 4186.01
  },
  {
    note: 'C#8',
    frequency: 4434.92
  },
  {
    note: 'D8',
    frequency: 4698.63
  },
  {
    note: 'D#8',
    frequency: 4978.03
  },
  {
    note: 'E8',
    frequency: 5274.04
  },
  {
    note: 'F8',
    frequency: 5587.65
  },
  {
    note: 'F#8',
    frequency: 5919.91
  },
  {
    note: 'G8',
    frequency: 6271.93
  },
  {
    note: 'G#8',
    frequency: 6644.88
  },
  {
    note: 'A8',
    frequency: 7040
  },
  {
    note: 'A#8',
    frequency: 7458.62
  },
  {
    note: 'B8',
    frequency: 7902.13
  }
]

module.exports = notes;
