import { clear, loadSound, getSound } from '../store';

describe('#loadSound', () => {
  const mockAudioElement = (supported) => {
    document.createElement = jest.fn(() => {
      return {
        canPlayType: jest.fn(() => supported ? 'maybe' : null)
      };
    });
  };

  beforeEach(() => {
    clear();
  });

  describe('when a sound with the same key already exists', () => {
    beforeEach(() => {
      mockAudioElement(true);
      loadSound('sound', 'foo.com/sound');
    });

    it('throws an exception', () => {
      expect(() => loadSound('sound', 'foo.com/sound'))
        .toThrowError('Sound with sound already exists in the store');
    });
  });

  describe('when a sound with a key that does not already exist', () => {
    describe('when the browser supports any of the available audio types', () => {
      let audio;

      beforeEach(() => {
        mockAudioElement(true);
        loadSound('sound', 'foo.com/sound');
        audio = getSound('sound');
      });

      it('stores the sound in the store', () => {
        expect(audio.path)
          .toBe('foo.com/sound');
      });

      it('sets the src attribute for the sound', () => {
        expect(audio.element.src)
          .toBe('foo.com/sound.mp3');
      });
    });

    describe('when the browser does not support any of the available audio types', () => {
      it('throws an exception', () => {
        mockAudioElement(false);
        expect(() => loadSound('sound', 'foo.com/sound'))
          .toThrowError('Browser does not support available audio types');
      });
    });
  });
});
