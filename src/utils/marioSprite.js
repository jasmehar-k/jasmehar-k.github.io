// Rendering metrics for the two Mario sprites.
//
// The files frame their character very differently, so you cannot just drop both
// into one box and expect them to match. Measured from the assets:
//
//   mario_slide.png  492x876  character fills 94.7% of the height,
//                             sits 1.4% off the bottom and +3.6% right of centre
//   mario_run.gif    135x160  character fills 85.6% (bobbing 130-145px over the
//                             25 frames), 2.3% off the bottom, +8.1% right
//
// Given the height you want the *character* to be, this returns the frame height
// to render at, how far to nudge it down so the feet land on the ground, and how
// far to nudge it sideways so the character — not the frame — is centred.
import marioRunSrc from '../assets/mario_run.gif';
import marioIdleSrc from '../assets/mario_slide.png';

const METRICS = {
  idle: { src: marioIdleSrc, fill: 0.9475, bottom: 0.0137, offset: 0.0356, aspect: 492 / 876 },
  run: { src: marioRunSrc, fill: 0.8563, bottom: 0.0225, offset: 0.0807, aspect: 135 / 160 },
};

export function marioSprite(kind, characterHeight) {
  const m = METRICS[kind];
  const frame = characterHeight / m.fill;
  return {
    src: m.src,
    frame: Math.round(frame),
    drop: Math.round(m.bottom * frame),
    nudge: Math.round(m.offset * frame * m.aspect),
  };
}

export default marioSprite;
