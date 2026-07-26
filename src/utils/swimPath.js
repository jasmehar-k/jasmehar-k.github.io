// Solves mario's vertical route through a side-scrolling level.
//
// Sampled across the stretch of level he actually covers. At each sample we
// take every obstacle overlapping that column, find the widest clear channel of
// water between them, and aim for its middle. Deciding per-obstacle instead
// would make him fight himself wherever two obstacles overlap; solving for the
// free gap handles any arrangement.
//
// obstacles: [{ x, half, top, bottom }] in track coordinates
// returns { x0, x1, ys } — ys sampled evenly from x0 to x1

const clamp = (v, lo, hi) => Math.max(lo, Math.min(v, hi));

export function buildSwimPath(obstacles, opts) {
  const {
    x0, x1, top, bot, clear, startY, endY,
    step = 24, smoothPx = 360, passes = 3, relaxIters = 24, endHoldPx = 0,
  } = opts;

  const n = Math.max(2, Math.ceil(Math.abs(x1 - x0) / step));
  const ys = new Array(n + 1);
  const los = new Array(n + 1);
  const his = new Array(n + 1);
  const need = clear * 2;

  // Forward sweep with hysteresis. Picking the widest gap each time makes him
  // flip sides whenever two channels are close in size, which reads as darting;
  // once a channel is wide enough to fit through, nearness to where he already
  // is decides instead, so he commits to a lane and only leaves when it closes.
  let prevY = startY;

  for (let k = 0; k <= n; k += 1) {
    const x = x0 + ((x1 - x0) * k) / n;
    const spans = obstacles
      .filter((o) => x >= o.x - o.half - clear && x <= o.x + o.half + clear)
      .sort((a, b) => a.top - b.top);

    const gaps = [];
    let cursor = top;
    spans.forEach((s) => {
      if (s.top > cursor) gaps.push([cursor, s.top]);
      cursor = Math.max(cursor, s.bottom);
    });
    if (bot > cursor) gaps.push([cursor, bot]);
    if (!gaps.length) gaps.push([top, bot]);

    let lo = gaps[0][0];
    let hi = gaps[0][1];
    let bestScore = -Infinity;
    gaps.forEach(([a, b]) => {
      const mid = (a + b) / 2;
      const score = Math.min(b - a, need) * 3 - Math.abs(mid - prevY);
      if (score > bestScore) {
        bestScore = score;
        lo = a;
        hi = b;
      }
    });

    los[k] = lo;
    his[k] = hi;
    ys[k] = (lo + hi) / 2;
    prevY = ys[k];
  }

  // Level off at the exit height for the final stretch, so he finishes with a
  // flat horizontal swim into the pipe instead of dropping into it.
  if (endHoldPx > 0) {
    const holdFrom = x1 - endHoldPx;
    for (let k = n; k >= 0; k -= 1) {
      if (x0 + ((x1 - x0) * k) / n < holdFrom) break;
      ys[k] = endY;
    }
  }

  // dives in at the surface, finishes centred on the exit
  ys[0] = startY;
  ys[n] = endY;

  // The raw route is a staircase: it holds one height across a card, then steps
  // in the gap. Nudging neighbours a few times only rounds the corners of that
  // staircase, which still reads as stop-start. Blurring over a span comparable
  // to the card spacing dissolves the steps entirely and leaves one continuous
  // rise and fall down the level.
  const r = Math.max(1, Math.round(smoothPx / step));
  const blurred = (src) => {
    const out = new Array(n + 1);
    for (let k = 0; k <= n; k += 1) {
      let sum = 0;
      for (let j = k - r; j <= k + r; j += 1) {
        sum += src[clamp(j, 0, n)]; // edge-replicate rather than fade to zero
      }
      out[k] = sum / (r * 2 + 1);
    }
    return out;
  };

  let path = ys;
  for (let pass = 0; pass < passes; pass += 1) path = blurred(path);

  // Ease the ends onto the exact dive-in and pipe-entry targets. Pinning them
  // outright would leave a step where the blur has pulled the neighbours away.
  const ramp = Math.max(1, Math.round((smoothPx * 1.3) / step));
  const dStart = startY - path[0];
  const dEnd = endY - path[n];
  for (let k = 0; k <= Math.min(ramp, n); k += 1) {
    const w = 1 - k / ramp;
    path[k] += dStart * w;
    path[n - k] += dEnd * w;
  }

  // Relaxation. Clamping the blurred curve into the channels in one shot leaves
  // hard flats wherever it was violating, which is the staircase again. Instead
  // alternate a gentle push back inside the channel with a light re-smooth, so
  // each correction gets spread over its neighbours. Because the curve is
  // already smooth the corrections are small, and repeating converges on a path
  // that is both continuous and genuinely clear.
  const bound = (k) => {
    const margin = Math.min(clear, (his[k] - los[k]) * 0.35);
    return [los[k] + margin, his[k] - margin];
  };

  for (let iter = 0; iter < relaxIters; iter += 1) {
    for (let k = 1; k < n; k += 1) {
      const [lo, hi] = bound(k);
      // ease toward the channel rather than snapping onto its edge
      if (path[k] < lo) path[k] += (lo - path[k]) * 0.5;
      else if (path[k] > hi) path[k] -= (path[k] - hi) * 0.5;
    }
    const prev = path.slice();
    for (let k = 1; k < n; k += 1) {
      path[k] = (prev[k - 1] + prev[k] * 2 + prev[k + 1]) / 4;
    }
  }

  // final pass is a hard projection, so clearance is guaranteed rather than
  // merely converged toward
  for (let k = 0; k <= n; k += 1) {
    const [lo, hi] = bound(k);
    ys[k] = clamp(clamp(path[k], lo, hi), top + clear, bot - clear);
  }
  ys[0] = startY;
  ys[n] = endY;

  return { x0, x1, ys };
}

// Sample the solved path at a track coordinate.
export function swimPathAt(path, x) {
  const { x0, x1, ys } = path;
  const last = ys.length - 1;
  const u = clamp((x - x0) / (x1 - x0), 0, 1) * last;
  const k = Math.min(last - 1, Math.floor(u));
  return ys[k] + (ys[k + 1] - ys[k]) * (u - k);
}

export default buildSwimPath;
