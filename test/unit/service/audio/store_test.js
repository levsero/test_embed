describe('audio-store', () => {
  let loadSound,
    playSound,
    getSound,
    mockAudioTypeResult;
  const storePath = buildSrcPath('service/audio/store');

  beforeEach(() => {
    mockery.enable();

    mockAudioTypeResult = 'mp3';

    initMockRegistry({
      'service/audio/util': { getSupportedAudioType: () => mockAudioTypeResult }
    });

    mockery.registerAllowable(storePath);

    const store = requireUncached(storePath);

    loadSound = store.loadSound;
    playSound = store.playSound;
    getSound = store.getSound;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#loadSound', () => {
    describe('when a sound with the same key already exists', () => {
      beforeEach(() => {
        loadSound('sound', 'foo.com/sound');
      });

      it('throws an exception', () => {
        expect(() => loadSound('sound', 'foo.com/sound'))
          .toThrowError('Sound with sound already exists in the store');
      });
    });

    describe('when a sound with the same key does not already exist', () => {
      describe('when the browser supports any of the available audio types', () => {
        let audio;

        beforeEach(() => {
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
        beforeEach(() => {
          mockAudioTypeResult = undefined;
        });

        it('throws an exception', () => {
          expect(() => loadSound('sound', 'foo.com/sound'))
            .toThrowError('Browser does not support available audio types');
        });
      });
    });
  });

  describe('#playSound', () => {
    describe('when the sound exists in the store', () => {
      let audio;

      beforeEach(() => {
        loadSound('sound', 'foo.com/sound');
        audio = getSound('sound');

        audio.element.play = jasmine.createSpy('play');
        playSound('sound');
      });

      it('calls the play function on the sound element', () => {
        expect(audio.element.play)
          .toHaveBeenCalled();
      });
    });
  });

  describe('#getSound', () => {
    beforeEach(() => {
      loadSound('sound', 'foo.com/sound');
    });

    describe('when the sound exists in the store', () => {
      it('returns the sound object', () => {
        expect(getSound('sound').path)
          .toBe('foo.com/sound');
      });
    });

    describe('when the sound does not exist in the store', () => {
      it('returns undefined', () => {
        expect(getSound('unknown'))
          .toBeUndefined();
      });
    });
  });
});
