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

// classic three-hump bush (also used for hills at a bigger scale)
const BUSH32 = [
  '..............BBBB..............',
  '............BBLLLLBB............',
  '...........BLLLLLLLLB...........',
  '..........BGGGGGGGGGGB..........',
  '...BBBB...BGGGGGGGGGGB...BBBB...',
  '..BLLLLB..BGGGGGGGGGGB..BLLLLB..',
  '.BGGGGGGBBGGGGGGGGGGGGBBGGGGGGB.',
  '.BGGGGGGGGGGGGGGGGGGGGGGGGGGGGB.',
  'BGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGB',
  'BGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGB',
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
];

// classic goomba
const GOOMBA16 = [
  '.....BBBBBB.....',
  '....BMMMMMMB....',
  '...BMMMMMMMMB...',
  '..BMMMMMMMMMMB..',
  '..BMWWBMMBWWMB..',
  '.BMMWWBMMBWWMMB.',
  '.BMMWBBMMBBWMMB.',
  'BMMMMMMMMMMMMMMB',
  'BMMMMMMMMMMMMMMB',
  '.BMMMMMMMMMMMMB.',
  '..BCCCCCCCCCCB..',
  '.BFFFCCCCCCFFFB.',
  '.BFFFFB..BFFFFB.',
];

// single-mound bush / hill
const MOUND24 = [
  '.........LLLLLL.........',
  '.......LLGGGGGGLL.......',
  '.....LLGGGGGGGGGGLL.....',
  '...LLGGGGGGGGGGGGGGLL...',
  '..LGGGGGGGGGGGGGGGGGL...',
  '.LGGGGGGDGGGGGGDGGGGGL..',
  'LGGGGGGGGGGGGGGGGGGGGGL.',
  'LGGGGGGGGGGGGGGGGGGGGGL.',
  '.GGGGGGGGGGGGGGGGGGGGG..',
];

// flagpole pennant, apex pointing left, small green dot emblem
const FLAG14 = [
  '............WW',
  '..........WWWW',
  '........WWWWWW',
  '......WWWWWWWW',
  '....WWWWWWWWWW',
  '..WWWWWWWGGWWW',
  'WWWWWWWWWGGWWW',
  '..WWWWWWWGGWWW',
  '....WWWWWWWWWW',
  '......WWWWWWWW',
  '........WWWWWW',
  '..........WWWW',
  '............WW',
];

// spinning-coin face
const COIN8 = [
  '..BBBB..',
  '.BGGGGB.',
  'BGGLLGGB',
  'BGGLLGGB',
  'BGGLLGGB',
  'BGGLLGGB',
  'BGGLLGGB',
  'BGGLLGGB',
  'BGGLLGGB',
  'BGGLLGGB',
  '.BGGGGB.',
  '..BBBB..',
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
    bush: sprite(BUSH32, { B: NES.black, L: '#b8f860', G: NES.greenLight }, 4),
    hill: sprite(BUSH32, { B: NES.black, L: '#58c838', G: '#2c9410' }, 9),
    mound: sprite(MOUND24, { L: NES.greenLight, G: NES.greenMid, D: NES.greenDark }, 4),
    goomba: sprite(GOOMBA16, { B: NES.black, M: '#9c4a00', W: NES.white, C: '#fcd8a8', F: '#3c1800' }, 3),
    flag: sprite(FLAG14, { W: NES.white, G: NES.greenMid }, 4),
    coin: sprite(COIN8, { B: '#7a5a08', G: NES.gold, L: '#fff8b0' }, 3),
    coral: sprite(CORAL12, { P: NES.coral }, 4),
  };
  return cache;
}
