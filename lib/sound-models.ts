export const SOUND_MODELS = [
  {
    name: "Facebook MMS - English",
    url: "https://api-inference.huggingface.co/models/facebook/mms-tts-eng",
    type: "huggingface",
  },
  {
    name: "MeloTTS - English (US)",
    url: "mrfakename/MeloTTS",
    type: "gradio",
    defaultSpeaker: "EN-US",
    defaultLanguage: "EN",
    modelPath: "/synthesize",
    requiresAuth: true,
  },
  // ...add more models as needed
] as const;

export type SoundModel = (typeof SOUND_MODELS)[number];
