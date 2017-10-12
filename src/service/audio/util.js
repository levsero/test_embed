import { includes } from 'lodash';

const canPlayTypeResultWhitelist = ['maybe', 'probably'];

export function getSupportedAudioType(audio) {
  if (!audio.canPlayType) {
    return;
  }

  const canPlayType = (type) => includes(canPlayTypeResultWhitelist, audio.canPlayType(type));

  if (canPlayType('audio/mpeg')) {
    return 'mp3';
  } else if (canPlayType('audio/ogg; codecs="vorbis"')) {
    return 'ogg';
  } else if (canPlayType('audio/wav')) {
    return 'wav';
  }
}
