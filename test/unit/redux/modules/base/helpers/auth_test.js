describe('auth utils', () => {
  let isTokenValid,
    extractTokenId,
    isTokenRenewable,
    mockSha1;
  const authPath = buildSrcPath('redux/modules/base/helpers/auth');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'utility/utils': {
        base64decode: window.atob,
        sha1: () => mockSha1
      }
    });

    isTokenValid = require(authPath).isTokenValid;
    extractTokenId = require(authPath).extractTokenId;
    isTokenRenewable = require(authPath).isTokenRenewable;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('isTokenValid', () => {
    let result,
      token,
      currDate = Date.now();

    beforeEach(() => {
      jasmine.clock().install();
      jasmine.clock().mockDate(currDate);
      result = isTokenValid(token);
    });

    describe('when token has expired', () => {
      beforeAll(() => {
        token = {
          expiry: Math.floor(currDate / 1000) - 100
        };
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when token has not expired', () => {
      beforeAll(() => {
        token = {
          expiry: Math.floor(currDate / 1000) + 100
        };
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when token does not exist', () => {
      beforeAll(() => {
        token = undefined;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when token expiry does not exist', () => {
      beforeAll(() => {
        token = {
          expiry: undefined
        };
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('extractTokenId', () => {
    let result,
      jwt;

    beforeEach(() => {
      result = extractTokenId(jwt);
    });

    describe('when there is an invalid jwt', () => {
      beforeAll(() => {
        jwt = 'sdfgyuioiuygfvbh';
      });

      it('returns null', () => {
        expect(result)
          .toEqual(null);
      });
    });

    describe('when there is a valid jwt with email', () => {
      beforeAll(() => {
        jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20ifQ.bQcIku6h4lURPrw-gu_irjfYdbwZW8cVB9tCGA-crCA';
        mockSha1 = 'a6ad00ac113a19d953efb91820d8788e2263b28a';
      });

      it('returns hash of the email payload', () => {
        expect(result)
          .toEqual('a6ad00ac113a19d953efb91820d8788e2263b28a');
      });
    });

    describe('valid jwt with no email', () => {
      beforeAll(() => {
        jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJub19lbWFpbCI6InByZXNlbnRfaGVlcmUifQ.i_sFJE6tj9uwqXt5nn9owqlLuJRv_kOMUYHmoJDegzU';
      });

      it('returns null', () => {
        expect(result)
          .toEqual(null);
      });
    });
  });

  describe('isTokenRenewable', () => {
    let result,
      token,
      currDate = Date.now();

    beforeEach(() => {
      jasmine.clock().install();
      jasmine.clock().mockDate(currDate);
      result = isTokenRenewable(token);
    });

    describe('when not expired and can renew', () => {
      let expiryDate = Math.floor(currDate / 1000) + 1000;

      beforeAll(() => {
        token = {
          expiry: expiryDate
        };
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when not expired and cannot renew', () => {
      let expiryDate = Math.floor(currDate / 1000) + 10000;

      beforeAll(() => {
        token = {
          expiry: expiryDate
        };
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when token has expired', () => {
      let expiryDate = Math.floor(currDate / 1000) - 1000;

      beforeAll(() => {
        token = {
          expiry: expiryDate
        };
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when token does not exist', () => {
      beforeAll(() => {
        token = undefined;
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when token expiry does not exist', () => {
      beforeAll(() => {
        token = {
          expiry: undefined
        };
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });
});
