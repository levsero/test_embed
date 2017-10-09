const audioStore = {};

export function load(audioFile) {
  const { key, path } = audioFile;
  const audio = new Audio(path);

  audioStore[key] = audio;
}

export function play(key) {
  const audio = audioStore[key];

  if (audio) {
    audio.play();
  }
}
