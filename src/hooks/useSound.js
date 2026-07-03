import { useEffect, useState } from 'react';

// Tiny WebAudio chiptune synth shared by the whole site.
// All sounds are generated (no audio files) so they stay a few lines each.

const STORAGE_KEY = 'marioMuted';

let ctx = null;
let masterGain = null;
let muted =
  typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) === '1';

function ensure() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = muted ? 0 : 0.14;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone({ type = 'square', from = 440, to = null, dur = 0.15, vol = 0.5, delay = 0 }) {
  if (!ensure()) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export const sfx = {
  coin() {
    tone({ from: 988, dur: 0.08, vol: 0.35 });
    tone({ from: 1319, dur: 0.4, vol: 0.35, delay: 0.08 });
  },
  jump() {
    tone({ from: 200, to: 640, dur: 0.18, vol: 0.22 });
  },
  bump() {
    tone({ type: 'triangle', from: 110, to: 70, dur: 0.12, vol: 0.55 });
  },
  pipe() {
    tone({ from: 520, to: 130, dur: 0.35, vol: 0.32 });
  },
  flag() {
    [523, 659, 784, 1047].forEach((f, i) => tone({ from: f, dur: 0.12, vol: 0.28, delay: i * 0.09 }));
  },
  powerOn() {
    [262, 330, 392, 523, 659].forEach((f, i) => tone({ from: f, dur: 0.1, vol: 0.25, delay: i * 0.07 }));
  },
};

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  try {
    localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
  } catch {
    /* private mode */
  }
  if (masterGain) masterGain.gain.value = muted ? 0 : 0.14;
  window.dispatchEvent(new Event('mario:mute'));
  return muted;
}

export function useMuted() {
  const [m, setM] = useState(muted);
  useEffect(() => {
    const onChange = () => setM(muted);
    window.addEventListener('mario:mute', onChange);
    return () => window.removeEventListener('mario:mute', onChange);
  }, []);
  return m;
}
