// World 1-1 tiles, drawn to match the NES original.
import { sprite, NES, BLOCK_TILE } from './pixelSprite.js';

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

/* Solid stair block. Light band across the top and down the left, black band
   across the bottom and down the right — and crucially the two bands meet on a
   diagonal at the top-right and bottom-left corners. That mitre is what makes
   the X-shaped seams where four blocks meet in the game. */
const STAIR = [
  'LLLLLLLLLLLLLLLK',
  'LLLLLLLLLLLLLLKK',
  'LLLLLLLLLLLLLKKK',
  'LLLMMMMMMMMMMKKK',
  'LLLMMMMMMMMMMKKK',
  'LLLMMMMMMMMMMKKK',
  'LLLMMMMMMMMMMKKK',
  'LLLMMMMMMMMMMKKK',
  'LLLMMMMMMMMMMKKK',
  'LLLMMMMMMMMMMKKK',
  'LLLMMMMMMMMMMKKK',
  'LLLMMMMMMMMMMKKK',
  'LLLMMMMMMMMMMKKK',
  'LLLKKKKKKKKKKKKK',
  'LLKKKKKKKKKKKKKK',
  'LKKKKKKKKKKKKKKK',
];

/* Climbing vine: a stem with leaf clusters alternating left and right. Tiles
   vertically, so the leaves keep alternating however long the vine is. */
const VINE = [
  '......DMML......',
  '......DMML......',
  '......DMMLDDD...',
  '......DMMLMMMD..',
  '......DMMLLMMD..',
  '......DMMLDDD...',
  '......DMML......',
  '......DMML......',
  '......DMML......',
  '...DDDDMML......',
  '..DMMMDMML......',
  '..DMMLDMML......',
  '...DDDDMML......',
  '......DMML......',
  '......DMML......',
  '......DMML......',
];

/* Top of the vine: the stem thins and curls over into a shoot, so the vine ends
   in a growing tip instead of a flat cut. Stem sits in the same columns as the
   body tile so the two line up. */
const VINE_TIP = [
  '................',
  '.........DD.....',
  '........DMML....',
  '.......DMMLD....',
  '......DMMLD.....',
  '......DMML......',
  '......DMMLDDD...',
  '......DMMLMMMD..',
  '......DMMLLMMD..',
  '......DMMLDDD...',
  '......DMML......',
  '......DMML......',
  '......DMML......',
  '......DMML......',
  '......DMML......',
  '......DMML......',
];

/* Flagpole pennant: white triangle pointing at the pole, green skull on it */
const FLAG = [
  '..............WWWW',
  '............WWWWWW',
  '..........WWWWWWWW',
  '........WWWWWWWWWW',
  '......WWWWWGGGWWWW',
  '....WWWWWWGGGGGWWW',
  '..WWWWWWWWGWGWGWWW',
  '..WWWWWWWWGGGGGWWW',
  '....WWWWWWWGGGWWWW',
  '......WWWWWGWGWWWW',
  '........WWWWWWWWWW',
  '..........WWWWWWWW',
  '............WWWWWW',
  '..............WWWW',
];

/* Castle masonry: staggered courses picked out in a lighter mortar */
const CASTLE_BRICK = [
  'LLLLLLLLLLLLLLLL',
  'MMMMMMMLMMMMMMML',
  'MMMMMMMLMMMMMMML',
  'MMMMMMMLMMMMMMML',
  'LLLLLLLLLLLLLLLL',
  'MMMLMMMMMMMLMMMM',
  'MMMLMMMMMMMLMMMM',
  'MMMLMMMMMMMLMMMM',
  'LLLLLLLLLLLLLLLL',
  'MMMMMMMLMMMMMMML',
  'MMMMMMMLMMMMMMML',
  'MMMMMMMLMMMMMMML',
  'LLLLLLLLLLLLLLLL',
  'MMMLMMMMMMMLMMMM',
  'MMMLMMMMMMMLMMMM',
  'MMMLMMMMMMMLMMMM',
];

export const overworld = {
  stair: sprite(STAIR, {
    L: NES.stairLight,
    M: NES.stairMid,
    K: NES.black,
  }),
  // same tile as the underwater level's floor, in browns
  soil: sprite(BLOCK_TILE, {
    L: NES.soilLight,
    M: NES.soilMid,
    D: NES.soilDark,
    K: NES.black,
  }),
  flag: sprite(FLAG, { W: NES.white, G: NES.greenMid }),
  vine: sprite(VINE, {
    D: NES.greenDark,
    M: NES.greenMid,
    L: NES.greenLight,
  }),
  vineTip: sprite(VINE_TIP, {
    D: NES.greenDark,
    M: NES.greenMid,
    L: NES.greenLight,
  }),
  castleBrick: sprite(CASTLE_BRICK, {
    L: NES.castleMortar,
    M: NES.castleBrick,
  }),
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
