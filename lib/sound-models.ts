export interface SoundModel {
  name: string;
  url: string;
}

export const SOUND_MODELS: SoundModel[] = [
  {
    name: "Model 1",
    url: "https://api-inference.huggingface.co/models/espnet/kan-bayashi_ljspeech_vits",
  },
  {
    name: "Model 2",
    url: "https://api-inference.huggingface.co/models/facebook/fastspeech2-en-ljspeech",
  },
  {
    name: "Model 3",
    url: "https://api-inference.huggingface.co/models/hexgrad/Kokoro-82M",
  },
];
