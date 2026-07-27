// Shared pixel-art plumbing: character grids in, SVG data URIs out.
// '.' is transparent; every other character maps to a palette entry.
// Rows are run-length encoded into <rect> spans so the data URIs stay small.

// Colours lifted from the NES Super Mario Bros palette.
export const NES = {
  black: '#000000',
  white: '#fcfcfc',

  // overworld
  sky: '#5c94fc',
  groundLight: '#fc9838',
  groundMid: '#c84c0c',
  groundDark: '#881400',

  // ? blocks
  qLight: '#fce7c8',
  qMid: '#fc9838',
  qDark: '#e45c10',

  // pipes, hills, bushes
  greenLight: '#58d854',
  greenMid: '#00a800',
  greenDark: '#006800',

  // underwater (world 2-2)
  water: '#2038ec',
  waterDeep: '#1028a8',
  mossLight: '#58d854',
  mossMid: '#00a800',
  mossDark: '#006800',
  coral: '#f4707c',
  coralDark: '#c03050',
  fishRed: '#f83800',
  fishDark: '#d82800',

  // pipe aliases kept for existing callers
  pipeLight: '#58d854',
  pipeMid: '#00a800',
  pipeDark: '#006800',
};

export function sprite(rows, palette) {
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

export default sprite;
