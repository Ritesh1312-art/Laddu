/* =========================================================
   Laddu Ka Khel Ghar — SFX + Music engine (Web Audio API)
   Koi audio file nahi — saari awaazein live synthesize hoti hain.
   ========================================================= */
(function () {
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null, master = null, muted = false;

  function ensure() {
    if (!AC) return null;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.8;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function env(g, t0, a, d, peak) {
    peak = peak == null ? 1 : peak;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
  }

  function tone(o) {
    const c = ensure(); if (!c) return;
    const t0 = o.t0 || 0, t = c.currentTime + t0;
    const osc = c.createOscillator();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.freq, t);
    if (o.glide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, o.freq + o.glide), t + (o.dur || 0.2));
    const g = c.createGain();
    env(g, t, o.attack || 0.012, o.dur || 0.25, o.vol == null ? 0.4 : o.vol);
    osc.connect(g); g.connect(master);
    osc.start(t); osc.stop(t + (o.dur || 0.25) + 0.15);
  }

  function noise(o) {
    const c = ensure(); if (!c) return;
    const dur = (o && o.dur) || 0.2, t0 = (o && o.t0) || 0;
    const t = c.currentTime + t0;
    const len = Math.max(1, Math.floor(c.sampleRate * dur));
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = (o && o.type) || 'bandpass';
    f.frequency.value = (o && o.freq) || 1000;
    f.Q.value = (o && o.q) || 1;
    const g = c.createGain(); g.gain.value = (o && o.vol) || 0.25;
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t);
  }

  const N = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
    G4: 392.0, A4: 440.0, Bb4: 466.16, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, A5: 880.0
  };

  const sfx = {
    ensure: ensure,
    unlock() { ensure(); },
    setMuted(m) { muted = m; if (master) master.gain.value = m ? 0 : 0.8; },

    /* --- chhote click / tap awaazein --- */
    tap() { tone({ freq: 520, type: 'sine', dur: 0.06, vol: 0.22, glide: 220 }); },
    pop() { tone({ freq: 620, type: 'triangle', dur: 0.09, vol: 0.35, glide: 320 }); },
    popBig() {
      tone({ freq: 300, type: 'square', dur: 0.12, vol: 0.2, glide: 500 });
      noise({ dur: 0.12, vol: 0.25, freq: 2000, type: 'highpass' });
    },
    ding() { tone({ freq: 880, dur: 0.3, vol: 0.3 }); tone({ freq: 1318.5, t0: 0.06, dur: 0.4, vol: 0.2 }); },
    good() { [523.25, 659.25, 783.99].forEach((f, i) => tone({ freq: f, type: 'triangle', t0: i * 0.09, dur: 0.22, vol: 0.35 })); },
    chord() { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone({ freq: f, type: 'triangle', t0: i * 0.05, dur: 0.75, vol: 0.28 })); },
    jingle() { [1046.5, 1318.5, 1567.98].forEach((f, i) => tone({ freq: f, type: 'triangle', t0: i * 0.07, dur: 0.18, vol: 0.28 })); },

    /* --- funny / prank awaazein --- */
    boing() { tone({ freq: 160, type: 'sine', dur: 0.4, vol: 0.5, glide: 560 }); },
    honk() {
      tone({ freq: 220, type: 'square', dur: 0.22, vol: 0.16 });
      tone({ freq: 277, type: 'square', t0: 0.02, dur: 0.25, vol: 0.13 });
    },
    squeak() { tone({ freq: 900, type: 'square', dur: 0.15, vol: 0.15, glide: 700 }); },
    whoosh() { noise({ dur: 0.35, vol: 0.22, freq: 700 }); tone({ freq: 280, dur: 0.3, vol: 0.12, glide: 520 }); },

    /* --- mystery awaazein --- */
    tick() { tone({ freq: 1200, type: 'square', dur: 0.04, vol: 0.14 }); },
    step() { noise({ dur: 0.09, vol: 0.16, freq: 320, type: 'lowpass' }); },
    whisper() { noise({ dur: 0.55, vol: 0.1, freq: 850, q: 5 }); },
    ching() { tone({ freq: 2093, type: 'sine', dur: 0.5, vol: 0.18 }); tone({ freq: 2637, t0: 0.03, dur: 0.4, vol: 0.1 }); },

    /* --- vlog / camera --- */
    shutter() { noise({ dur: 0.12, vol: 0.35, freq: 2600, type: 'highpass' }); tone({ freq: 900, type: 'square', dur: 0.05, vol: 0.14 }); },
    record() { tone({ freq: 660, type: 'square', dur: 0.14, vol: 0.18 }); },
    like() { tone({ freq: 987.77, dur: 0.12, vol: 0.3 }); tone({ freq: 1318.5, t0: 0.08, dur: 0.2, vol: 0.22 }); },

    /* --- music / instruments --- */
    key(freq, vol, dur) {
      vol = vol == null ? 0.4 : vol; dur = dur == null ? 0.5 : dur;
      tone({ freq: freq, type: 'triangle', dur: dur, vol: vol });
      tone({ freq: freq * 2, type: 'sine', dur: dur * 0.8, vol: vol * 0.25 });
    },
    drum() { tone({ freq: 120, type: 'sine', dur: 0.28, vol: 0.55, glide: -70 }); noise({ dur: 0.06, vol: 0.18, freq: 420, type: 'lowpass' }); },
    clap() { noise({ dur: 0.1, vol: 0.32, freq: 1800, q: 1.5 }); },
    bell() { tone({ freq: 1567.98, dur: 0.9, vol: 0.28 }); tone({ freq: 2093, t0: 0.02, dur: 0.7, vol: 0.12 }); },
    tambourine() { noise({ dur: 0.12, vol: 0.3, freq: 5000, type: 'highpass' }); tone({ freq: 3200, dur: 0.15, vol: 0.1 }); },

    /* --- Happy Birthday (key of F) --- */
    BPM: 118,
    MELODY: [
      ['C4', 0.5], ['C4', 0.5], ['D4', 1], ['C4', 1], ['F4', 1], ['E4', 2],
      ['C4', 0.5], ['C4', 0.5], ['D4', 1], ['C4', 1], ['G4', 1], ['F4', 2],
      ['C4', 0.5], ['C4', 0.5], ['C5', 1.5], ['A4', 0.5], ['F4', 1], ['E4', 1], ['D4', 3],
      ['Bb4', 0.5], ['Bb4', 0.5], ['A4', 1.5], ['F4', 0.5], ['G4', 1], ['F4', 2]
    ],
    playMelody(onStep, vol) {
      const c = ensure(); if (!c) return Promise.resolve();
      const step = 60 / this.BPM;
      return new Promise(res => {
        let acc = 0.2;
        this.MELODY.forEach((n, i) => {
          const f = N[n[0]], d = n[1] * step;
          this.key(f, vol == null ? 0.4 : vol, Math.min(0.62, d * 0.92));
          setTimeout(() => { if (onStep) onStep(i, f); }, acc * 1000);
          acc += d;
        });
        setTimeout(res, acc * 1000 + 350);
      });
    },

    /* --- simple beat loop (dance) --- */
    startBeat(onBeat) {
      this.stopBeat();
      ensure(); if (!ctx) return;
      let i = 0;
      sfx._beatTimer = setInterval(() => {
        if (i % 4 === 0) sfx.drum();
        if (i % 4 === 2) sfx.clap();
        if (onBeat) onBeat(i % 4);
        i++;
      }, 380);
    },
    stopBeat() { if (sfx._beatTimer) { clearInterval(sfx._beatTimer); sfx._beatTimer = null; } }
  };

  window.SFX = sfx;
})();
