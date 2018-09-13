import Color from 'color';

describe('ColorMixer', () => {
  let mixer,
    colorMixer,
    colorStr;

  const mixerPath = buildSrcPath('util/color/mixer');
  const baseColor = '#3accf5';

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'color': Color
    });

    colorMixer = require(mixerPath).ColorMixer;
    mixer = new colorMixer(baseColor);

    colorStr = '#FF69B4';
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('instantiation', () => {
    it('holds a white abstraction in state', () => {
      expect(mixer.white.hex()).toEqual('#FFFFFF');
    });

    it('holds a black abstraction in state', () => {
      expect(mixer.black.hex()).toEqual('#000000');
    });

    it('holds a neutral grey in state', () => {
      expect(mixer.neutralColor.hex()).toEqual('#7C7C7C');
    });

    it('holds the base colour in state', () => {
      expect(mixer.baseColor.hex()).toEqual('#3ACCF5');
    });

    it('holds a buttonColor in state', () => {
      expect(mixer.buttonColor.hex()).toEqual('#3ACCF5');
    });

    it('holds a listColor in state', () => {
      expect(mixer.listColor.hex()).toEqual('#154F60');
    });
  });

  describe('#getBaseColor', () => {
    it('returns a string representation of the base color', () => {
      expect(mixer.getBaseColor()).toEqual('#3ACCF5');
    });
  });

  describe('#highlight', () => {
    describe('when the colour is perceptually dark', () => {
      it('intensifies it by lightening it', () => {
        colorStr = '#101CE3';
        expect(mixer.highlight(colorStr)).toEqual('#1C28EF');
      });
    });

    describe('when the colour is perceptually light', () => {
      it('intensifies it by darkening it', () => {
        colorStr = '#c1fadb';
        expect(mixer.highlight(colorStr)).toEqual('#84F5B7');
      });
    });
  });

  describe('#alpha', () => {
    it('returns a rgba css-valid string with a certain alpha colour', () => {
      expect(mixer.alpha('#101CE3', .2)).toEqual('rgba(16, 28, 227, 0.2)');
    });
  });

  describe('#getButtonColor', () => {
    describe('when the colour is not extremely light', () => {
      it('returns the same colour as the base', () => {
        expect(mixer.getButtonColor()).toEqual('#3ACCF5');
      });
    });

    describe('when the colour is extremely light or white', () => {
      beforeEach(() => {
        mixer = new colorMixer('#FFFFFF');
      });

      it('returns a neutral grey', () => {
        expect(mixer.getButtonColor()).toEqual('#7C7C7C');
      });
    });
  });

  describe('#getListColor', () => {
    describe('when the colour is dark', () => {
      describe('and it contrasts enough against white', () => {
        beforeEach(() => {
          mixer = new colorMixer('#515F31');
        });

        it('returns the same colour as the base', () => {
          expect(mixer.getListColor()).toEqual('#515F31');
        });
      });

      describe('and it does not contrast enough against white', () => {
        describe('and the accessibility setting is enabled', () => {
          beforeEach(() => {
            mixer = new colorMixer('#CC04FB');
          });

          it('returns an accessible, accentuated colour', () => {
            expect(mixer.getListColor()).toEqual('#1D0522');
          });
        });

        describe('and the accessibility setting is disabled', () => {
          beforeEach(() => {
            mixer = new colorMixer('#CC04FB', { bypassA11y: true });
          });

          it('returns the same colour', () => {
            expect(mixer.getListColor()).toEqual('#CC04FB');
          });
        });
      });
    });

    describe('when the colour is light', () => {
      describe('and the accessibility setting is enabled', () => {
        beforeEach(() => {
          mixer = new colorMixer('#C4C846');
        });

        it('returns an accessible, accentuated colour', () => {
          expect(mixer.getListColor()).toEqual('#4A4B20');
        });
      });

      describe('and the accessibility setting is disabled', () => {
        beforeEach(() => {
          mixer = new colorMixer('#C4C846', { bypassA11y: true });
        });

        it('returns a darker but not necessarily accessible colour', () => {
          expect(mixer.getListColor()).toEqual('#5B5C28');
        });
      });
    });
  });

  describe('#uiElementColorFrom', () => {
    describe('when the colour is dark', () => {
      it('returns the same colour', () => {
        expect(mixer.uiElementColorFrom('#515F31')).toEqual('#515F31');
      });
    });

    describe('when the colour is light', () => {
      describe('and the accessibility setting is enabled', () => {
        it('returns an accessible, accentuated colour', () => {
          expect(mixer.uiElementColorFrom('#C4C846')).toEqual('#4A4B20');
        });
      });

      describe('and the accessibility setting is disabled', () => {
        beforeEach(() => {
          mixer = new colorMixer(baseColor, { bypassA11y: true });
        });

        it('returns a darker but not necessarily accessible colour', () => {
          expect(mixer.uiElementColorFrom('#C4C846')).toEqual('#5B5C28');
        });
      });
    });
  });

  describe('#foregroundColorFrom', () => {
    describe('when the colour is dark', () => {
      describe('and it contrasts enough against white', () => {
        it('returns white', () => {
          expect(mixer.foregroundColorFrom('#515F31')).toEqual('#FFFFFF');
        });
      });

      describe('and it does not contrast enough against white', () => {
        describe('and the accessibility setting is enabled', () => {
          it('returns an accessible, accentuated colour', () => {
            expect(mixer.foregroundColorFrom('#CC04FB')).toEqual('#1D0522');
          });
        });

        describe('and the accessibility setting is disabled', () => {
          beforeEach(() => {
            mixer = new colorMixer(baseColor, { bypassA11y: true });
          });

          it('returns white', () => {
            expect(mixer.foregroundColorFrom('#CC04FB')).toEqual('#FFFFFF');
          });
        });
      });
    });

    describe('when the colour is light', () => {
      describe('and the accessibility setting is enabled', () => {
        it('returns an accessible, accentuated colour', () => {
          expect(mixer.foregroundColorFrom('#C4C846')).toEqual('#4A4B20');
        });
      });

      describe('and the accessibility setting is disabled', () => {
        beforeEach(() => {
          mixer = new colorMixer(baseColor, { bypassA11y: true });
        });

        it('returns a darker but not necessarily accessible colour', () => {
          expect(mixer.foregroundColorFrom('#C4C846')).toEqual('#5B5C28');
        });
      });
    });
  });
});
