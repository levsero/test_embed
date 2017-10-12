import { loadSound, playSound, getSound } from 'service/audio/store';

export const audio = {
  load: loadSound,
  play: playSound,
  get: getSound
};
