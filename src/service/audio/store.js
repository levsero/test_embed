import { getSupportedAudioType } from 'service/audio/util';

const audioStore = {};

export function loadSound(key, path) {
  if (audioStore[key]) {
    throw new Error(`Sound with ${key} already exists in the store`);
  }

  const element = document.createElement('audio');
  const srcType = getSupportedAudioType(element);

  if (!srcType) {
    throw new Error('Browser does not support available audio types');
  }

  element.src = `${path}.${srcType}`;
  audioStore[key] = { element, path };
}

export function playSound(key) {
  const audio = audioStore[key];

  if (audio) {
    audio.element.play();
  }
}

export function getSound(key) {
  return audioStore[key];
}

