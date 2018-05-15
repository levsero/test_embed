describe('chat utils', () => {
  let chatNameDefault,
    isAgent;

  const chatUtilPath = buildSrcPath('util/chat');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'constants/chat': {
        AGENT_BOT: 'agent:trigger'
      }
    });

    chatNameDefault = require(chatUtilPath).chatNameDefault;
    isAgent = require(chatUtilPath).isAgent;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('chatNameDefault', () => {
    const validNames = [
      'Visitor 26681136',
      'Visitor 1234567890463274356726736476353276435674834747835746574647878372436573657847',
      'Visitor 000000'
    ];
    const invalidNames = [
      'Mike',
      '',
      'visitor joe',
      'visitor 123',
      'Visitor jay',
      '??! []',
      'Visitor []',
      null,
      undefined,
      {},
      [],
      10000
    ];

    _.forEach(validNames, (name) => it(`should return true for ${name}`, () => {
      expect(chatNameDefault(name))
        .toEqual(true);
    }));

    _.forEach(invalidNames, (name) => it(`should return false for ${name}`, () => {
      expect(chatNameDefault(name))
        .toEqual(false);
    }));
  });

  describe('isAgent', () => {
    let result,
      mockNick;

    beforeEach(() => {
      result = null;
      result = isAgent(mockNick);
    });

    describe('when nick is agent:123', () => {
      beforeAll(() => {
        mockNick = 'agent:123';
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when nick is agent bot', () => {
      beforeAll(() => {
        mockNick = 'agent:trigger';
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when nick is visitor', () => {
      beforeAll(() => {
        mockNick = 'visitor';
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });
});
