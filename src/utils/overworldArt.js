// World 1-1 tiles, drawn to match the NES original.
import { sprite, NES } from './pixelSprite.js';

/* Floor block: light top-left edge, black right and bottom so tiling reads as
   a grid of separate blocks, with the speckle pattern from the game. */
const GROUND = [
  'LLLLLLLLLLLLLLLB',
  'LMMMMMMMMMMMMMMB',
  'LMMMMMMMMMMMMMMB',
  'LMMDMMMMMMMMDMMB',
  'LMMMMMMMMMMMMMMB',
  'LMMMMMMMMMMMMMMB',
  'LMMMMMMDDMMMMMMB',
  'LMMMMMMDDMMMMMMB',
  'LMMMMMMMMMMMMMMB',
  'LMMMMMMMMMMMMMMB',
  'LMMDMMMMMMMMDMMB',
  'LMMMMMMMMMMMMMMB',
  'LMMMMMMMMMMMMMMB',
  'LMMMMMMDDMMMMMMB',
  'LMMMMMMMMMMMMMMB',
  'BBBBBBBBBBBBBBBB',
];

/* Brick block: four staggered courses of masonry */
const BRICK = [
  'BBBBBBBBBBBBBBBB',
  'LLLLLLLBLLLLLLLL',
  'MMMMMMMBMMMMMMMM',
  'MMMMMMMBMMMMMMMM',
  'BBBBBBBBBBBBBBBB',
  'LLLBLLLLLLLLLLLB',
  'MMMBMMMMMMMMMMMB',
  'MMMBMMMMMMMMMMMB',
  'BBBBBBBBBBBBBBBB',
  'LLLLLLLBLLLLLLLL',
  'MMMMMMMBMMMMMMMM',
  'MMMMMMMBMMMMMMMM',
  'BBBBBBBBBBBBBBBB',
  'LLLBLLLLLLLLLLLB',
  'MMMBMMMMMMMMMMMB',
  'MMMBMMMMMMMMMMMB',
];

/* ? block, with the rivets in the corners */
const QBLOCK = [
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

const USED = QBLOCK.map((row) => row.replace(/C/g, 'O'));

/* Rolling hill, with the pair of dark notches the game draws on its slope */
const HILL = [
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

/* Three-lobed bush */
const BUSH = [
  '..........BBBB..........',
  '.....BBB.BGGGGB.BBB.....',
  '...BBGGGBGGGGGGBGGGBB...',
  '..BGGGGGGGGGGGGGGGGGGB..',
  '.BGGGGGGGGGGGGGGGGGGGGB.',
  'BGGGGGGGGGGGGGGGGGGGGGGB',
  'GGGGGGGGGGGGGGGGGGGGGGGG',
];

/* Cloud: two stacked lobes over a flat base, black outline */
const CLOUD = [
  '..........BBBB..................',
  '........BBWWWWBB................',
  '.......BWWWWWWWWB......BBBB.....',
  '.....BBWWWWWWWWWWBB..BBWWWWBB...',
  '...BBWWWWWWWWWWWWWWBBWWWWWWWWB..',
  '..BWWWWWWWWWWWWWWWWWWWWWWWWWWWB.',
  '.BWWWWWWWWWWWWWWWWWWWWWWWWWWWWWB',
  'BWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWB',
  'BWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWB',
  '.BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB.',
];

export const overworld = {
  ground: sprite(GROUND, {
    L: NES.groundLight,
    M: NES.groundMid,
    D: NES.groundDark,
    B: NES.black,
  }),
  brick: sprite(BRICK, {
    L: NES.groundLight,
    M: NES.groundMid,
    B: NES.black,
  }),
  qBlock: sprite(QBLOCK, {
    B: NES.black,
    L: NES.qLight,
    O: NES.qMid,
    D: NES.qDark,
    C: NES.qLight,
  }),
  usedBlock: sprite(USED, {
    B: NES.black,
    L: '#c88054',
    O: '#9c5020',
    D: '#6e3410',
  }),
  hill: sprite(HILL, { B: NES.black, G: NES.greenMid }),
  bush: sprite(BUSH, { B: NES.black, G: NES.greenMid }),
  cloud: sprite(CLOUD, { B: NES.black, W: NES.white }),
};

export default overworld;
