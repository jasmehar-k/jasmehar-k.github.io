// NES-style pixel tiles drawn in code: pixel maps → canvas → data URLs.
// Palette keys: each map picks its own characters; '.' is transparent.

function sprite(map, palette, scale = 3) {
  if (typeof document === 'undefined') return '';
  const h = map.length;
  const w = map[0].length;
  const canvas = document.createElement('canvas');
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext('2d');
  map.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const color = palette[ch];
      if (!color) return;
      ctx.fillStyle = color;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    });
  });
  return canvas.toDataURL();
}

export const NES = {
  sky: '#5c94fc',
  black: '#000000',
  white: '#fcfcfc',
  groundMid: '#c84c0c',
  groundLight: '#fcbcb0',
  qOrange: '#fc9838',
  qShadow: '#c84c0c',
  qCream: '#fce7c8',
  tealMid: '#18b0a0',
  tealLight: '#78e8d8',
  grayMid: '#bcbcbc',
  grayLight: '#fcfcfc',
  lavaRed: '#d82800',
  lavaDark: '#981000',
  water: '#2048e8',
  greenLight: '#80d010',
  greenMid: '#38a010',
  greenDark: '#005800',
  coral: '#f87858',
  gold: '#fbd000',
};

// staggered brick courses, 8px high, 1px mortar
const BRICK16 = [
  'LLLLLLLLLLLLLLLB',
  'LMMMMMMMMMMMMMMB',
  'LMMMMMMMMMMMMMMB',
  'LMMMMMMMMMMMMMMB',
  'LMMMMMMMMMMMMMMB',
  'LMMMMMMMMMMMMMMB',
  'LMMMMMMMMMMMMMMB',
  'BBBBBBBBBBBBBBBB',
  'LLLLLLLBLLLLLLLL',
  'MMMMMMMBLMMMMMMM',
  'MMMMMMMBLMMMMMMM',
  'MMMMMMMBLMMMMMMM',
  'MMMMMMMBLMMMMMMM',
  'MMMMMMMBLMMMMMMM',
  'MMMMMMMBLMMMMMMM',
  'BBBBBBBBBBBBBBBB',
];

const QBLOCK16 = [
  '.BBBBBBBBBBBBBB.',
  'BLLLLLLLLLLLLLDB',
  'BLDOOOOOOOOOODDB',
  'BLOOOOCCCCOOOODB',
  'BLOOOCCOOCCOOODB',
  'BLOOOCCOOCCOOODB',
  'BLOOOOOOOCCOOODB',
  'BLOOOOOOCCOOOODB',
  'BLOOOOOCCOOOOODB',
  'BLOOOOOCCOOOOODB',
  'BLOOOOOOOOOOOODB',
  'BLOOOOOCCOOOOODB',
  'BLOOOOOCCOOOOODB',
  'BLDOOOOOOOOOODDB',
  'BDDDDDDDDDDDDDDB',
  '.BBBBBBBBBBBBBB.',
];

const QBLOCK_PLAIN16 = QBLOCK16.map((row) => row.replace(/C/g, 'O'));

// lava crest: white bumps over transparent, body red below (strip supplies red bg)
const LAVA16 = [
  '...WW.......WW..',
  '..WWWW.....WWWW.',
  'RRRRRRRRRRRRRRRR',
  'RRRRRRRRRRRRRRRR',
  'RRRDRRRRRRRRDRRR',
  'RRRRRRRRRRRRRRRR',
  'RRRRRRRDDRRRRRRR',
  'RRRRRRRRRRRRRRRR',
  'RRRRRRRRRRRRRRRR',
  'RRDRRRRRRRRRRDRR',
  'RRRRRRRRRRRRRRRR',
  'RRRRRRRRRRRRRRRR',
  'RRRRRRRDDRRRRRRR',
  'RRRRRRRRRRRRRRRR',
  'RRRRRRRRRRRRRRRR',
  'RRRRRRRRRRRRRRRR',
];

// scalloped wave bump, water body below
const WAVE16 = [
  '......WWWW......',
  '....WW....WW....',
  '..WW........WW..',
  'WW............WW',
  '................',
  '................',
  '................',
  '................',
];

// underwater seabed: staggered green knobs
const BLOB8 = [
  '.LLLLL..',
  'LLGGGGL.',
  'LGGGGGGL',
  'LGGGGGGL',
  'LGGGGGDL',
  '.DDDDDD.',
  '........',
  '........',
];
const SEABED16 = BLOB8.map((row) => row + row).concat(
  BLOB8.map((row) => row.slice(4) + row + row.slice(0, 4)),
);

// smb overworld hill: smooth dome, black outline, diagonal spot pair
const HILL32 = [
  '.............BBBBBB.............',
  '...........BBGGGGGGBB...........',
  '..........BGGGGGGGGGGB..........',
  '.........BGGGGGGGGGGGGB.........',
  '........BGGGGGGGGGGGGGGB........',
  '.......BGGGGGGGGGGBBGGGGB.......',
  '......BGGGGGGGGGGGBBGGGGGB......',
  '.....BGGGGGGGGGGBBGGGGGGGGB.....',
  '....BGGGGGGGGGGGBBGGGGGGGGGB....',
  '...BGGGGGGGGGGGGGGGGGGGGGGGGB...',
  '..BGGGGGGGGGGGGGGGGGGGGGGGGGGB..',
  '.BGGGGGGGGGGGGGGGGGGGGGGGGGGGGB.',
  'BGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGB',
  'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
];

// flagpole pennant: full at the top, tapering down toward the pole,
// green emblem near the top-left — like the game
const FLAG16 = [
  'WWWWWWWWWWWWWWWW',
  '.WWWWWWWWWWWWWWW',
  '..WWWGGGGWWWWWWW',
  '...WGGGGGGWWWWWW',
  '....GGGGGGWWWWWW',
  '.....GGGGWWWWWWW',
  '......WWWWWWWWWW',
  '.......WWWWWWWWW',
  '........WWWWWWWW',
  '.........WWWWWWW',
  '..........WWWWWW',
  '...........WWWWW',
  '............WWWW',
  '.............WWW',
];

// branchy pink coral
const CORAL12 = [
  '..P......P..',
  '..PP.....P..',
  '...P..P..PP.',
  '.P.PP.P..P..',
  '.PP.P.PP.P..',
  '..P.PPP.PP..',
  '..PP.PP.P...',
  '...PPPPPP...',
  '....PPPP....',
  '....PPPP....',
];

let cache = null;

export function tiles() {
  if (cache) return cache;
  const b = NES.black;
  cache = {
    ground: sprite(BRICK16, { L: NES.groundLight, M: NES.groundMid, B: b }),
    tealBrick: sprite(BRICK16, { L: NES.tealLight, M: NES.tealMid, B: b }),
    stone: sprite(BRICK16, { L: NES.grayLight, M: NES.grayMid, B: b }),
    qBlock: sprite(QBLOCK16, { B: b, L: NES.qCream, O: NES.qOrange, D: NES.qShadow, C: NES.qCream }),
    qBlockPlain: sprite(QBLOCK_PLAIN16, { B: b, L: NES.qCream, O: NES.qOrange, D: NES.qShadow }),
    usedBlock: sprite(QBLOCK_PLAIN16, { B: b, L: '#c88054', O: '#9c5020', D: '#6e3410' }),
    brickBlock: sprite(BRICK16, { L: NES.groundLight, M: NES.groundMid, B: b }),
    lava: sprite(LAVA16, { W: NES.white, R: NES.lavaRed, D: NES.lavaDark }),
    wave: sprite(WAVE16, { W: NES.white }),
    seabed: sprite(SEABED16, { L: NES.greenLight, G: NES.greenMid, D: NES.greenDark }),
    bush: sprite(HILL32, { B: NES.black, G: '#3ba60e' }, 4),
    hill: sprite(HILL32, { B: NES.black, G: '#3ba60e' }, 9),
    flag: sprite(FLAG16, { W: NES.white, G: '#3ba60e' }, 4),
    coral: sprite(CORAL12, { P: NES.coral }, 4),
  };
  return cache;
}
