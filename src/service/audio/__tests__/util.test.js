import { getSupportedAudioType } from '../util';

describe('#getSupportedAudioType', () => {
  let audioElement;

  beforeEach(() => {
    audioElement = document.createElement('audio');
  });

  describe('when canPlayType is undefined', () => {
    beforeEach(() => {
      audioElement.canPlayType = undefined;
    });

    it('returns undefined', () => {
      expect(getSupportedAudioType(audioElement))
        .toBeUndefined();
    });
  });

  describe('when canPlayType is defined', () => {
    let params;

    describe('when audio/mpeg is ', () => {
      describe('probably supported', () => {
        beforeEach(() => {
          params = { 'audio/mpeg': 'probably' };
          audioElement.canPlayType = jest.fn((param) => params[param]);
        });

        it('returns mp3', () => {
          expect(getSupportedAudioType(audioElement))
            .toBe('mp3');
        });
      });

      describe('maybe supported', () => {
        beforeEach(() => {
          params = { 'audio/mpeg': 'maybe' };
          audioElement.canPlayType = jest.fn((param) => params[param]);
        });

        it('returns mp3', () => {
          expect(getSupportedAudioType(audioElement))
            .toBe('mp3');
        });
      });

      describe('not supported', () => {
        describe('when audio/ogg is ', () => {
          describe('probably supported', () => {
            beforeEach(() => {
              params = {
                'audio/mpeg': '',
                'audio/ogg; codecs="vorbis"': 'probably'
              };
              audioElement.canPlayType = jest.fn((param) => params[param]);
            });

            it('returns ogg', () => {
              expect(getSupportedAudioType(audioElement))
                .toBe('ogg');
            });
          });

          describe('maybe supported', () => {
            beforeEach(() => {
              params = {
                'audio/mpeg': '',
                'audio/ogg; codecs="vorbis"': 'maybe'
              };
              audioElement.canPlayType = jest.fn((param) => params[param]);
            });

            it('returns ogg', () => {
              expect(getSupportedAudioType(audioElement))
                .toBe('ogg');
            });
          });

          describe('not supported', () => {
            describe('when audio/wav is ', () => {
              describe('probably supported', () => {
                beforeEach(() => {
                  params = {
                    'audio/mpeg': '',
                    'audio/ogg; codecs="vorbis"': '',
                    'audio/wav': 'probably'
                  };
                  audioElement.canPlayType = jest.fn((param) => params[param]);
                });

                it('returns wav', () => {
                  expect(getSupportedAudioType(audioElement))
                    .toBe('wav');
                });
              });

              describe('maybe supported', () => {
                beforeEach(() => {
                  params = {
                    'audio/mpeg': '',
                    'audio/ogg; codecs="vorbis"': '',
                    'audio/wav': 'maybe'
                  };
                  audioElement.canPlayType = jest.fn((param) => params[param]);
                });

                it('returns wav', () => {
                  expect(getSupportedAudioType(audioElement))
                    .toBe('wav');
                });
              });

              describe('not supported', () => {
                beforeEach(() => {
                  params = {
                    'audio/mpeg': '',
                    'audio/ogg; codecs="vorbis"': '',
                    'audio/wav': ''
                  };
                  audioElement.canPlayType = jest.fn((param) => params[param]);
                });

                it('returns undefined', () => {
                  expect(getSupportedAudioType(audioElement))
                    .toBeUndefined();
                });
              });
            });
          });
        });
      });
    });
  });
});
