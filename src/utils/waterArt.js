// NES-style pixel art for the world 2-2 water level, drawn in code as character
// grids and emitted as SVG data URIs. '.' is transparent; every other character
// maps to a palette entry.
//
// Rows are run-length encoded into <rect> spans so the data URIs stay small.

import { BLOCK_TILE, NES as BASE } from './pixelSprite.js';

// One palette, shared with the rest of the site so a colour can never be
// changed in one place and not the other. Only the exit pipe differs: the
// underwater one uses deeper greens than the overworld pipes.
export const NES = {
  ...BASE,
  pipeLight: '#7bd47f',
  pipeMid: '#43b047',
  pipeDark: '#0a3d0f',
};

function svg(rows, palette) {
  const w = rows[0].length;
  const h = rows.length;
  let rects = '';

  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let run = 1;
      while (x + run < row.length && row[x + run] === ch) run += 1;
      const fill = palette[ch];
      if (fill) rects += `<rect x='${x}' y='${y}' width='${run}' height='1' fill='${fill}'/>`;
      x += run;
    }
  });

  const doc = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' shape-rendering='crispEdges'>${rects}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(doc)}")`;
}

/* Sharp sawtooth waterline — the game's surface is a hard triangle wave, not a
   soft scallop. Sky above the crest, white foam on it, water below. The sky has
   to be painted into the tile: the stage behind it is already water-blue. */
const WATERLINE = [
  'SSSSWSSS',
  'SSSWWWSS',
  'SSWWBWWS',
  'SWWBBBWW',
  'WWBBBBBW',
  'WBBBBBBB',
  'BBBBBBBB',
  'BBBBBBBB',
];


/* Branching coral: a central stem with paired branches forking upward off it,
   repeating up the stalk — the fern silhouette the game uses */
const CORAL = [
  '.....PP.....',
  '..P..PP..P..',
  '...P.PP.P...',
  '....PPPP....',
  '.P...PP...P.',
  '..P..PP..P..',
  '...P.PP.P...',
  '....PPPP....',
  '.P...PP...P.',
  '..PP.PP.PP..',
  '...P.PP.P...',
  '....PPPP....',
  '.P...PP...P.',
  '..P..PP..P..',
  '...P.PP.P...',
  '....DPPD....',
  '.P...PP...P.',
  '..PP.PP.PP..',
  '...P.PP.P...',
  '....PPPP....',
  '.....PP.....',
  '.....DD.....',
  '.....PP.....',
  '.....PP.....',
];

/* Blooper — pointed mantle flaring into side fins, a black eye band with two
   pale pupils, and thin tentacles trailing below */
const BLOOPER = [
  '.......WW.......',
  '......WWWW......',
  '.....WWWWWW.....',
  '....WWWWWWWW....',
  '...WWWWWWWWWW...',
  '..WWWWWWWWWWWW..',
  '.WWWWWWWWWWWWWW.',
  'WWWWWWWWWWWWWWWW',
  'WWW.WWWWWWWW.WWW',
  '....WWWWWWWW....',
  '...WWWWWWWWWW...',
  '...KKKKWWKKKK...',
  '...KWWKWWKWWK...',
  '...KWWKWWKWWK...',
  '...KKKKWWKKKK...',
  '...WWWWWWWWWW...',
  '...WW.WW.WW.WW..',
  '...WW.WW.WW.WW..',
  '...WW.WW.WW.WW..',
  '....W..WW..W....',
];

/* Cheep cheep — forked tail on the left, eye up front, facing right */
const CHEEP = [
  '.....RRRRR....',
  '...RRRRRRRRR..',
  'R..RRRRRRRRRR.',
  'RR.RRRRRRRRRRR',
  'RRRRRRRWWKRRRR',
  'RRRRRRRWWKRRRR',
  'RR.RRRRRRRRRRR',
  'R..RRRRRRRRRR.',
  '...RRRRRRRRR..',
  '.....RRRRR....',
];

export const art = {
  waterline: svg(WATERLINE, { S: NES.sky, W: NES.white, B: NES.water }),
  moss: svg(BLOCK_TILE, {
    K: NES.black,
    L: NES.mossLight,
    M: NES.mossMid,
    D: NES.mossDark,
  }),
  coral: svg(CORAL, { P: NES.coral, D: NES.coralDark }),
  blooper: svg(BLOOPER, { K: NES.black, W: NES.white }),
  cheep: svg(CHEEP, { R: NES.fishRed, W: NES.white, K: NES.black }),
};

export default art;
