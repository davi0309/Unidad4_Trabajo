/**
 * AUDIO.JS - Motor Sonoro Inmersivo de Panem (Web Audio API Nativo)
 * Sintetizador cinematográfico modal, reverberación procedural y análisis acústico en tiempo real.
 */

const AudioEngine = {
  ctx: null,
  masterGain: null,
  masterFilter: null,
  reverbNode: null,
  reverbGain: null,
  dryGain: null,
  analyserNode: null,
  waveData: null,
  freqData: null,
  drones: [],
  isInitialized: false,

  // Afinación cinematográfica de los 12 Distritos (Sol Menor / Dórico)
  districtFreqs: [
    587.33, // D1: Lujo - D5 (Campana de cristal dorada)
    466.16, // D2: Armas - Bb4 (Metal militar penetrante)
    523.25, // D3: Tecnología - C5 (FM resonante)
    349.23, // D4: Pesca - F4 (Viento marino fluido)
    392.00, // D5: Energía - G4 (Rayo tónico brillante)
    311.13, // D6: Transporte - Eb4 (Pulso motriz)
    293.66, // D7: Madera - D4 (Madera cálida / marimba)
    261.63, // D8: Textil - C4 (Cuerda resonante)
    233.08, // D9: Cereales - Bb3 (Viento entre trigo)
    220.00, // D10: Ganado - A3 (Cuerno profundo)
    196.00, // D11: Agricultura - G3 (Tierra y raíz)
    146.83  // D12: Minería - D3 (Carbón y yunque subterráneo)
  ],

  // Silbido legendario de Rue / Katniss (G4 - Bb4 - A4 - D4)
  rueWhistleNotes: [392.00, 466.16, 440.00, 293.66],

  createProceduralReverb(duration = 2.4, decay = 2.6) {
    let sampleRate = this.ctx.sampleRate;
    let length = sampleRate * duration;
    let impulse = this.ctx.createBuffer(2, length, sampleRate);
    let left = impulse.getChannelData(0);
    let right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      let n = (length - i) / length;
      let env = Math.pow(n, decay);
      left[i] = (Math.random() * 2 - 1) * env;
      right[i] = (Math.random() * 2 - 1) * env;
    }
    return impulse;
  },

  async init() {
    if (this.isInitialized) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    // Ganancia Maestra
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    // Analizador de Audio para "Ver cómo suena"
    this.analyserNode = this.ctx.createAnalyser();
    this.analyserNode.fftSize = 256;
    this.analyserNode.smoothingTimeConstant = 0.8;
    this.waveData = new Uint8Array(this.analyserNode.fftSize);
    this.freqData = new Uint8Array(this.analyserNode.frequencyBinCount);

    // Filtro Maestro Lowpass modulado por Kuramoto (R)
    this.masterFilter = this.ctx.createBiquadFilter();
    this.masterFilter.type = 'lowpass';
    this.masterFilter.frequency.setValueAtTime(350, this.ctx.currentTime);
    this.masterFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    // Reverb Convolutiva de la Arena
    this.reverbNode = this.ctx.createConvolver();
    this.reverbNode.buffer = this.createProceduralReverb();

    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    this.dryGain = this.ctx.createGain();
    this.dryGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

    // Rutas de Audio
    this.masterFilter.connect(this.dryGain);
    this.masterFilter.connect(this.reverbNode);
    this.reverbNode.connect(this.reverbGain);

    this.dryGain.connect(this.masterGain);
    this.reverbGain.connect(this.masterGain);

    this.masterGain.connect(this.analyserNode);
    this.analyserNode.connect(this.ctx.destination);

    // 12 Drones Polifónicos de Fase
    this.drones = [];
    for (let i = 0; i < 12; i++) {
      let osc = this.ctx.createOscillator();
      let oscSub = this.ctx.createOscillator();
      let gain = this.ctx.createGain();

      if (i < 3) {
        osc.type = 'triangle';
        oscSub.type = 'sine';
      } else if (i < 6) {
        osc.type = 'sawtooth';
        oscSub.type = 'triangle';
      } else if (i < 9) {
        osc.type = 'sine';
        oscSub.type = 'triangle';
      } else {
        osc.type = 'triangle';
        oscSub.type = 'sawtooth';
      }

      let baseF = this.districtFreqs[i];
      osc.frequency.setValueAtTime(baseF, this.ctx.currentTime);
      oscSub.frequency.setValueAtTime(baseF * 0.5, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.004, this.ctx.currentTime);

      osc.connect(gain);
      oscSub.connect(gain);
      gain.connect(this.masterFilter);

      osc.start();
      oscSub.start();

      this.drones.push({ osc, oscSub, gain, baseFreq: baseF });
    }

    this.isInitialized = true;
  },

  updateDynamics(R_coherence, districtsList) {
    if (!this.isInitialized) return;

    let targetCutoff = 280 + R_coherence * (4200 - 280);
    this.masterFilter.frequency.setTargetAtTime(targetCutoff, this.ctx.currentTime, 0.08);

    for (let i = 0; i < districtsList.length; i++) {
      let d = districtsList[i];
      let drone = this.drones[i];
      if (!drone) continue;

      if (d.isIsolated) {
        drone.gain.gain.setTargetAtTime(0.002, this.ctx.currentTime, 0.08);
      } else {
        let phaseVolume = 0.003 + (Math.sin(d.theta) + 1) * 0.5 * 0.047;
        phaseVolume *= (0.5 + R_coherence * 0.8);
        drone.gain.gain.setTargetAtTime(phaseVolume, this.ctx.currentTime, 0.04);
      }
    }
  },

  triggerDistrictSound(index, isIsolated, velocity = 1.0) {
    if (!this.isInitialized) return;
    let now = this.ctx.currentTime;
    let baseF = this.districtFreqs[index];

    let osc = this.ctx.createOscillator();
    let oscHarmonic = this.ctx.createOscillator();
    let noteGain = this.ctx.createGain();

    if (isIsolated) {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseF * 0.85, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

      oscHarmonic.type = 'square';
      oscHarmonic.frequency.setValueAtTime(baseF * 1.42, now);
      oscHarmonic.frequency.exponentialRampToValueAtTime(30, now + 0.35);

      noteGain.gain.setValueAtTime(0.18 * velocity, now);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
    } else {
      if (index < 3) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseF, now);
        oscHarmonic.type = 'sine';
        oscHarmonic.frequency.setValueAtTime(baseF * 2.0, now);
      } else if (index < 6) {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseF, now);
        oscHarmonic.type = 'sine';
        oscHarmonic.frequency.setValueAtTime(baseF * 1.5, now);
      } else if (index < 9) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseF, now);
        oscHarmonic.type = 'triangle';
        oscHarmonic.frequency.setValueAtTime(baseF * 0.5, now);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseF, now);
        oscHarmonic.type = 'sine';
        oscHarmonic.frequency.setValueAtTime(baseF * 0.5, now);
      }

      noteGain.gain.setValueAtTime(0.24 * velocity, now);
      let decayTime = index < 3 ? 0.7 : (index >= 9 ? 0.85 : 0.55);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);
    }

    osc.connect(noteGain);
    oscHarmonic.connect(noteGain);
    noteGain.connect(this.masterFilter);

    osc.start(now);
    oscHarmonic.start(now);
    osc.stop(now + 0.8);
    oscHarmonic.stop(now + 0.8);
  },

  playRueWhistle() {
    if (!this.isInitialized) return;
    let now = this.ctx.currentTime;
    let noteDuration = 0.42;
    let gap = 0.05;

    for (let i = 0; i < this.rueWhistleNotes.length; i++) {
      let noteStart = now + i * (noteDuration + gap);
      let freq = this.rueWhistleNotes[i];

      let osc = this.ctx.createOscillator();
      let lfo = this.ctx.createOscillator();
      let lfoGain = this.ctx.createGain();
      let g = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteStart);

      lfo.frequency.setValueAtTime(5.5, noteStart);
      lfoGain.gain.setValueAtTime(4.0, noteStart);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      g.gain.setValueAtTime(0.001, noteStart);
      g.gain.linearRampToValueAtTime(0.18, noteStart + 0.08);
      g.gain.setValueAtTime(0.16, noteStart + noteDuration - 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

      osc.connect(g);
      g.connect(this.reverbNode);
      g.connect(this.masterGain);

      lfo.start(noteStart);
      osc.start(noteStart);
      lfo.stop(noteStart + noteDuration + 0.05);
      osc.stop(noteStart + noteDuration + 0.05);
    }
  }
};