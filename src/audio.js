// audio.js —— 全程序化音频(WebAudio,无素材)
export class AudioFX {
  constructor() { this.ctx = null; this.heartTimer = null; }

  resume() {
    if (this.ctx) { this.ctx.resume(); return; }
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    this.ctx = new C();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.55;
    this.master.connect(this.ctx.destination);
    this._wind();
  }

  _noiseBuffer(sec = 2) {
    const len = this.ctx.sampleRate * sec;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  _wind() {
    const src = this.ctx.createBufferSource();
    src.buffer = this._noiseBuffer(4); src.loop = true;
    const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 320; lp.Q.value = 0.4;
    const g = this.ctx.createGain(); g.gain.value = 0.05;
    const lfo = this.ctx.createOscillator(); lfo.frequency.value = 0.09;
    const lfoG = this.ctx.createGain(); lfoG.gain.value = 0.028;
    lfo.connect(lfoG); lfoG.connect(g.gain);
    src.connect(lp); lp.connect(g); g.connect(this.master);
    src.start(); lfo.start();
  }

  _burst(freq, q, dur, gain, type = 'bandpass') {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const src = this.ctx.createBufferSource(); src.buffer = this._noiseBuffer(0.5);
    const f = this.ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(this.master);
    src.start(t); src.stop(t + dur + 0.05);
  }

  chip() {
    this._burst(5200, 1.2, 0.05, 0.16, 'highpass');
    setTimeout(() => this._burst(4200, 1.2, 0.04, 0.1, 'highpass'), 40 + Math.random() * 60);
  }

  card() { this._burst(1400, 0.8, 0.13, 0.12); }

  thud() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(82, t);
    o.frequency.exponentialRampToValueAtTime(38, t + 0.22);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + 0.3);
    this._burst(300, 0.6, 0.12, 0.12, 'lowpass');
  }

  chime() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [660, 990].forEach((fq, i) => {
      const o = this.ctx.createOscillator(); o.type = 'sine'; o.frequency.value = fq;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, t + i * 0.12);
      g.gain.linearRampToValueAtTime(0.16, t + i * 0.12 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.12 + 1.4);
      o.connect(g); g.connect(this.master);
      o.start(t + i * 0.12); o.stop(t + i * 0.12 + 1.5);
    });
  }

  win() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [523, 659, 784].forEach((fq, i) => {
      const o = this.ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = fq;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, t + i * 0.09);
      g.gain.linearRampToValueAtTime(0.12, t + i * 0.09 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.8);
      o.connect(g); g.connect(this.master);
      o.start(t + i * 0.09); o.stop(t + i * 0.09 + 0.9);
    });
  }

  heartStart() {
    if (!this.ctx || this.heartTimer) return;
    const beat = () => { this.thud(); setTimeout(() => this.thud(), 190); };
    beat();
    this.heartTimer = setInterval(beat, 950);
  }

  heartStop() {
    if (this.heartTimer) { clearInterval(this.heartTimer); this.heartTimer = null; }
  }
}
