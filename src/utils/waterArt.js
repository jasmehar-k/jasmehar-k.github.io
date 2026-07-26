// NES-style pixel art for the world 2-2 water level, drawn in code as character
// grids and emitted as SVG data URIs. '.' is transparent; every other character
// maps to a palette entry.
//
// Rows are run-length encoded into <rect> spans so the data URIs stay small.

export const NES = {
  sky: '#3b9aff',
  water: '#2038ec',
  waterDeep: '#1028a8',
  white: '#fcfcfc',
  black: '#000000',
  mossLight: '#58d854',
  mossMid: '#00a800',
  mossDark: '#006800',
  coral: '#f4707c',
  coralDark: '#c03050',
  fishRed: '#f83800',
  fishDark: '#d82800',
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

/* Mossy terrain block. One tile does all three jobs the game uses it for:
   the seabed floor, stacked columns, and floating platforms. */
const MOSS = [
  'KKKKKKKKKKKKKKKK',
  'KLLMMMMMMMMMMLLK',
  'KLMMDDMMMMDDMMLK',
  'KMMDDDMMMDDDMMMK',
  'KMMMDMMMMMDMMMMK',
  'KMMMMMMDMMMMMDMK',
  'KMMDMMMDDMMMMDMK',
  'KMMDDMMMMMMMDDMK',
  'KMMMDMMMMMMMDMMK',
  'KMMMMMMMDMMMMMMK',
  'KMDMMMMDDMMMDMMK',
  'KMDDMMMMMMMMDDMK',
  'KMMDMMMMMMMMMDMK',
  'KMMMMMMMMMMMMMMK',
  'KDDMMMMMMMMMMDDK',
  'KKKKKKKKKKKKKKKK',
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
  moss: svg(MOSS, {
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
