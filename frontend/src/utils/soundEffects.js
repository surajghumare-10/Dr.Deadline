// Web Audio API Synthesizer for natural tactile paper mechanics

let audioCtx = null;

function getContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Natural Paper Tear / Rip SFX (Multi-layered fibrous rip)
export function playRipSound() {
  try {
    const ctx = getContext();
    if (!ctx) return;

    // Layer A: Crackling white/pink noise burst (paper grain tearing)
    const duration = 0.32;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Modulated noise envelope for irregular tear texture
      const progress = i / bufferSize;
      const grain = (Math.random() * 2 - 1) * (0.8 + 0.4 * Math.sin(progress * 40));
      data[i] = grain * Math.sin(progress * Math.PI);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter sweeps frequency as rip travels across paper
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.15);
    filter.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + duration);
    filter.Q.value = 1.4;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();

    // Layer B: Subtle paper snap at the end
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(280, ctx.currentTime + 0.18);
    snapOsc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.28);
    snapGain.gain.setValueAtTime(0.2, ctx.currentTime + 0.18);
    snapGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    snapOsc.connect(snapGain);
    snapGain.connect(ctx.destination);
    snapOsc.start(ctx.currentTime + 0.18);
    snapOsc.stop(ctx.currentTime + 0.28);

  } catch (e) {
    console.warn("Audio rip error:", e);
  }
}

// 2. Natural Paper Crumple SFX (Crackling multi-crunch impulses)
export function playCrumpleSound() {
  try {
    const ctx = getContext();
    if (!ctx) return;

    // 4 successive crinkling micro-bursts as paper folds in on itself
    [0, 0.08, 0.17, 0.26].forEach((delay, idx) => {
      const dur = 0.18;
      const bSize = ctx.sampleRate * dur;
      const buf = ctx.createBuffer(1, bSize, ctx.sampleRate);
      const ch = buf.getChannelData(0);

      for (let i = 0; i < bSize; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bSize * 0.35));
      }

      const src = ctx.createBufferSource();
      src.buffer = buf;

      const filt = ctx.createBiquadFilter();
      filt.type = 'lowpass';
      filt.frequency.setValueAtTime(1400 - (idx * 250), ctx.currentTime + delay);
      filt.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + delay + dur);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.35 - (idx * 0.05), ctx.currentTime + delay);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);

      src.connect(filt);
      filt.connect(g);
      g.connect(ctx.destination);
      src.start(ctx.currentTime + delay);
      src.stop(ctx.currentTime + delay + dur);
    });

  } catch (e) {
    console.warn("Audio crumple error:", e);
  }
}

// 3. Pushpin Pin Sound
export function playPinSound() {
  try {
    const ctx = getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

// 4. Mascot Warning Alarm
export function playMascotAlarm() {
  try {
    const ctx = getContext();
    if (!ctx) return;
    [392, 523.25].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + (idx * 0.12));
      gain.gain.setValueAtTime(0.15, ctx.currentTime + (idx * 0.12));
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (idx * 0.12) + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + (idx * 0.12));
      osc.stop(ctx.currentTime + (idx * 0.12) + 0.2);
    });
  } catch (e) {}
}
