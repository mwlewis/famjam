class PitchShifterProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'pitch', defaultValue: 1.0, minValue: 0.5, maxValue: 2.0, automationRate: 'k-rate' },
      { name: 'mix', defaultValue: 1.0, minValue: 0.0, maxValue: 1.0, automationRate: 'k-rate' }
    ];
  }
  constructor() {
    super();
    this.winSize = 1024;
    this.buffer = new Float32Array(this.winSize * 2);
    this.bufWrite = 0;
    this.readPos = 0.0;
    this.window = new Float32Array(this.winSize);
    for (let i = 0; i < this.winSize; i++) {
      this.window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (this.winSize - 1))); // Hann
    }
  }
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    if (!input || !input[0]) return true;

    const inL = input[0];
    const outL = output[0];
    const pitch = parameters.pitch[0];
    const mix = parameters.mix[0];

    for (let n = 0; n < inL.length; n++) {
      // write into circular buffer
      this.buffer[this.bufWrite] = inL[n];
      this.buffer[this.bufWrite + this.winSize] = inL[n];
      this.bufWrite = (this.bufWrite + 1) % this.winSize;

      // read from buffer at variable rate (pitch)
      this.readPos += pitch;
      if (this.readPos >= this.winSize) this.readPos -= this.winSize;

      const i0 = this.readPos | 0;
      const frac = this.readPos - i0;
      const s0 = this.buffer[i0];
      const s1 = this.buffer[i0 + 1];
      const shifted = s0 + (s1 - s0) * frac;

      // simple crossfade window to reduce artifacts
      const w = this.window[this.bufWrite];
      const dry = inL[n];
      outL[n] = dry * (1 - mix) + shifted * w * mix;
    }
    return true;
  }
}
registerProcessor('pitch-shifter-processor', PitchShifterProcessor);
