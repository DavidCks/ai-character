export type VoiceNames = keyof typeof voices;

export type LangCodes =
  | "ar"
  | "ca"
  | "cs"
  | "cy"
  | "da"
  | "de"
  | "el"
  | "en"
  | "es"
  | "fa"
  | "fi"
  | "fr"
  | "hu"
  | "is"
  | "it"
  | "ka"
  | "kk"
  | "lb"
  | "ne"
  | "nl"
  | "no"
  | "pl"
  | "pt"
  | "ro"
  | "ru"
  | "sk"
  | "sl"
  | "sr"
  | "sv"
  | "sw"
  | "tr"
  | "uk"
  | "vi"
  | "zh";

export type VoiceType = {
  name: VoiceNames;
  modelUrl: string;
  modelConfigUrl: string;
  speakerId?: number;
  gender: "m" | "f" | "d";
  language: LangCodes;
};

const PIPER_VOICES_BASE = "/aic-runtime-deps/voices/piper/";

export const voices = {
  "wataame-chibi": {
    name: "wataame-chibi",
    modelUrl: `${PIPER_VOICES_BASE}en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx`,
    modelConfigUrl: `${PIPER_VOICES_BASE}en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx.json`,
    speakerId: 595,
    gender: "f",
    language: "en",
  },
  "wataame-v1": {
    name: "wataame-v1",
    modelUrl: `${PIPER_VOICES_BASE}en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx`,
    modelConfigUrl: `${PIPER_VOICES_BASE}en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx.json`,
    speakerId: 11,
    gender: "f",
    language: "en",
  },
  "wataame-v2": {
    name: "wataame-v2",
    modelUrl: `${PIPER_VOICES_BASE}en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx`,
    modelConfigUrl: `${PIPER_VOICES_BASE}en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx.json`,
    speakerId: 869,
    gender: "f",
    language: "en",
  },
  ruri: {
    name: "ruri",
    modelUrl: `${PIPER_VOICES_BASE}en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx`,
    modelConfigUrl: `${PIPER_VOICES_BASE}en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx.json`,
    speakerId: 250,
    gender: "f",
    language: "en",
  },
  yui: {
    name: "yui",
    modelUrl: `${PIPER_VOICES_BASE}en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx`,
    modelConfigUrl: `${PIPER_VOICES_BASE}en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx.json`,
    speakerId: 307,
    gender: "f",
    language: "en",
  },
  teco: {
    name: "yui",
    modelUrl: `${PIPER_VOICES_BASE}en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx`,
    modelConfigUrl: `${PIPER_VOICES_BASE}en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx.json`,
    speakerId: 131,
    gender: "f",
    language: "en",
  },
  thorsten: {
    name: "thorsten",
    modelUrl: `${PIPER_VOICES_BASE}de/de_DE/thorsten/medium/de_DE-thorsten-medium.onnx`,
    modelConfigUrl: `${PIPER_VOICES_BASE}de/de_DE/thorsten/medium/de_DE-thorsten-medium.onnx.json`,
    speakerId: undefined,
    gender: "m",
    language: "de",
  },
} as const;
