import Color from 'color';

describe('ColorMixer', () => {
  let mixer,
    colorMixer,
    colorStr;

  const mixerPath = buildSrcPath('util/color/mixer');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'color': Color
    });

    colorMixer = require(mixerPath).ColorMixer;
    mixer = new colorMixer;

    colorStr = '#FF69B4';
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#highlightColor', () => {
    it('intensifies a colour by a set amount', () => {
      expect(mixer.highlightColor(colorStr)).toEqual('#FF47A3');
    });
  });

  describe('#buttonColorFrom', () => {
    describe('if the colour is white or almost white', () => {
      it('returns a pre-set colour (#777)', () => {
        colorStr = '#FFF';
        expect(mixer.buttonColorFrom(colorStr)).toEqual('#777');
      });
    });

    describe('if the colour not is white or almost white', () => {
      it('returns the base colour', () => {
        expect(mixer.buttonColorFrom(colorStr)).toEqual('#FF69B4');
      });
    });
  });

  describe('#listColorFrom', () => {
    describe('when the colour is lighter than a set threshold', () => {
      it('returns a darkened version to contrast', () => {
        colorStr = '#F0F8FF';
        expect(mixer.listColorFrom(colorStr)).toEqual('#5B7086');

        colorStr = '#FFF8DC';
        expect(mixer.listColorFrom(colorStr)).toEqual('#958446');
      });
    });

    describe('when the colour is darker than a set threshold', () => {
      it('returns the same colour', () => {
        colorStr = '#310B44';
        expect(mixer.listColorFrom(colorStr)).toEqual('#310B44');
      });
    });
  });

  describe('#foregroundColorFrom', () => {
    describe('when the colour is lighter than a set threshold', () => {
      it('returns a darkened version to contrast', () => {
        colorStr = '#F0F8FF';
        expect(mixer.foregroundColorFrom(colorStr)).toEqual('#5D6C79');

        colorStr = '#FFF8DC';
        expect(mixer.foregroundColorFrom(colorStr)).toEqual('#80754D');
      });
    });

    describe('when the colour is darker than a set threshold', () => {
      it('returns white', () => {
        colorStr = '#00FF00';
        expect(mixer.foregroundColorFrom(colorStr)).toEqual('white');
      });
    });
  });
});
