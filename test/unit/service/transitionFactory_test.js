describe('transitionFactory', () => {
  let mockSettingsValue,
    mockMobileBrowserValue;

  const transitionFactoryPath = buildSrcPath('service/transitionFactory');

  beforeEach(() => {
    mockery.enable();

    mockSettingsValue = {
      'offset.vertical': 15,
      'position.vertical': 'bottom'
    };

    mockMobileBrowserValue = false;

    initMockRegistry({
      'service/settings': {
        settings: {
          get: (name) => mockSettingsValue[name],
          init: () => {}
        }
      },
      'utility/devices': {
        isMobileBrowser: () => mockMobileBrowserValue
      }
    });

    mockery.registerAllowable(transitionFactoryPath);
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#applyHiddenState', () => {
    let applyHiddenState;

    beforeEach(() => {
      applyHiddenState = requireUncached(transitionFactoryPath).applyHiddenState;
    });

    describe('when the embed is positioned on the bottom', () => {
      it('returns the default value, regardless of height', () => {
        expect(applyHiddenState(676).top)
          .toEqual('-9999px');
      });
    });

    describe('when the embed is positioned on the top', () => {
      describe("and the frame's height hasn't been calculated", () => {
        it('returns the default value', () => {
          expect(applyHiddenState(0, true).top)
            .toEqual('-9999px');
        });
      });

      describe("and the frame's height has been calculated", () => {
        it('returns the offscreen top value', () => {
          expect(applyHiddenState(300, true).top)
            .toEqual('-365px');
        });
      });
    });
  });

  describe('#transitionMaker', () => {
    let transitionMakerFunction,
      transitionMaker,
      defaultStart,
      defaultEnd;

    beforeEach(() => {
      defaultStart = {
        top: '99px',
        bottom: '10px'
      };
      defaultEnd = {
        top: '110px',
        bottom: '50px'
      };

      transitionMakerFunction = requireUncached(transitionFactoryPath).transitionMaker;
      transitionMaker = transitionMakerFunction(defaultStart, defaultEnd);
    });

    describe('when no overrides are given', () => {
      it('returns the defaults', () => {
        expect(transitionMaker())
          .toEqual({
            start: { top: '99px', bottom: '10px' },
            end: { top: '110px', bottom: '50px' }
          });
      });
    });

    describe('when overrides are given', () => {
      it('manufactures the new transition', () => {
        expect(transitionMaker({}, { top: '-788px' }))
          .toEqual({
            start: { top: '99px', bottom: '10px' },
            end: { top: '-788px', bottom: '50px' }
          });
      });
    });
  });

  describe('#positionWithOffset', () => {
    let positionWithOffset;

    beforeEach(() => {
      positionWithOffset = requireUncached(transitionFactoryPath).positionWithOffset;
    });

    describe("when there's no offset", () => {
      describe('and the browser is mobile', () => {
        beforeEach(() => {
          mockMobileBrowserValue = true;
        });

        it('returns the original position', () => {
          expect(positionWithOffset(99, 0))
            .toEqual('99px');
        });
      });

      describe('and the browser is desktop-based', () => {
        beforeEach(() => {
          mockMobileBrowserValue = false;
        });

        it('returns the original position', () => {
          expect(positionWithOffset(45, 0))
            .toEqual('45px');
        });
      });
    });

    describe('when there is an offset', () => {
      describe('and the browser is mobile', () => {
        beforeEach(() => {
          mockMobileBrowserValue = true;
        });

        it('returns the original position', () => {
          expect(positionWithOffset(33, 44))
            .toEqual('33px');
        });
      });

      describe('and the browser is desktop-based', () => {
        beforeEach(() => {
          mockMobileBrowserValue = false;
        });

        it('returns the original position', () => {
          expect(positionWithOffset(45, 44))
            .toEqual('89px');
        });
      });
    });
  });
});
