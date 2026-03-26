import { useCallback, useRef } from 'react';

// 音訊配置常數：包含所有時間、頻率、增益值
const AUDIO_CONFIG = {
  DRAW: {
    LAYER1: {
      INITIAL_FREQ: 220,
      FINAL_FREQ: 80,
      INITIAL_GAIN: 0.6,
      FINAL_GAIN: 0.001,
      FREQ_RAMP_TIME: 0.05,
      GAIN_DECAY_TIME: 0.08,
      STOP_TIME: 0.1,
    },
    LAYER2: {
      FREQ: 880,
      INITIAL_GAIN: 0.3,
      FINAL_GAIN: 0.001,
      DELAY: 0.02,
      GAIN_DECAY_TIME: 0.14,
      STOP_TIME: 0.15,
    },
  },
  WIN: {
    NOTES: [
      { freq: 523, start: 0, dur: 0.15 },
      { freq: 659, start: 0.15, dur: 0.15 },
      { freq: 784, start: 0.3, dur: 0.4 },
      { freq: 1047, start: 0.3, dur: 0.4 },
    ],
    NOTE_GAIN: 0.25,
    NOTE_GAIN_DECAY: 0.001,
    NOTE_STOP_OFFSET: 0.05,
  },
} as const;

export function useSound(muted: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  function getCtx(): AudioContext {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }

  const playDrawSound = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    const now = ctx.currentTime;

    // 層 1：鋸齒波衝擊
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(AUDIO_CONFIG.DRAW.LAYER1.INITIAL_FREQ, now);
    osc1.frequency.exponentialRampToValueAtTime(
      AUDIO_CONFIG.DRAW.LAYER1.FINAL_FREQ,
      now + AUDIO_CONFIG.DRAW.LAYER1.FREQ_RAMP_TIME
    );
    gain1.gain.setValueAtTime(AUDIO_CONFIG.DRAW.LAYER1.INITIAL_GAIN, now);
    gain1.gain.exponentialRampToValueAtTime(
      AUDIO_CONFIG.DRAW.LAYER1.FINAL_GAIN,
      now + AUDIO_CONFIG.DRAW.LAYER1.GAIN_DECAY_TIME
    );
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + AUDIO_CONFIG.DRAW.LAYER1.STOP_TIME);

    // 層 2：方波確認音（延遲 20ms）
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(
      AUDIO_CONFIG.DRAW.LAYER2.FREQ,
      now + AUDIO_CONFIG.DRAW.LAYER2.DELAY
    );
    gain2.gain.setValueAtTime(
      AUDIO_CONFIG.DRAW.LAYER2.INITIAL_GAIN,
      now + AUDIO_CONFIG.DRAW.LAYER2.DELAY
    );
    gain2.gain.exponentialRampToValueAtTime(
      AUDIO_CONFIG.DRAW.LAYER2.FINAL_GAIN,
      now + AUDIO_CONFIG.DRAW.LAYER2.GAIN_DECAY_TIME
    );
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + AUDIO_CONFIG.DRAW.LAYER2.DELAY);
    osc2.stop(now + AUDIO_CONFIG.DRAW.LAYER2.STOP_TIME);
  }, [muted]);

  const playWinSound = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    const now = ctx.currentTime;

    AUDIO_CONFIG.WIN.NOTES.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + start);
      gain.gain.setValueAtTime(AUDIO_CONFIG.WIN.NOTE_GAIN, now + start);
      gain.gain.exponentialRampToValueAtTime(
        AUDIO_CONFIG.WIN.NOTE_GAIN_DECAY,
        now + start + dur
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur + AUDIO_CONFIG.WIN.NOTE_STOP_OFFSET);
    });
  }, [muted]);

  return { playDrawSound, playWinSound };
}
