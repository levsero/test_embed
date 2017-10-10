import _ from 'lodash';

const audioStore = {};
const canPlayTypeResultWhitelist = ['maybe', 'probably'];

export function load(key, path) {
  if (audioStore[key]) {
    return;
  }

  const audioElement = document.createElement('audio');
  const srcType = getSrcType(audioElement);

  if (!srcType) {
    throw new Error('Browser does not support required audio types');
  }

  audioElement.src = `${path}.${srcType}`;
  audioStore[key] = { audioElement, path };
}

export function play(key) {
  const { audioElement } = audioStore[key];

  if (audioElement) {
    audioElement.play();
  }
}

export function get(key) {
  return audioStore[key];
}

function getSrcType(audio) {
  if (!audio.canPlayType) {
    return;
  }

  const canPlayType = (type) => _.includes(canPlayTypeResultWhitelist, audio.canPlayType(type));

  if (canPlayType('audio/mpeg')) {
    return 'mp3';
  } else if (canPlayType('audio/ogg; codecs="vorbis"')) {
    return 'ogg';
  } else if (canPlayType('audio/wav')) {
    return 'wav';
  }
}
