describe('utils', () => {
  let splitPath,
    getPageKeywords,
    getPageTitle,
    nowInSeconds,
    objectDifference,
    cssTimeToMs,
    base64encode,
    emailValid,
    referrerPolicyUrl,
    getEnvironment,
    cappedTimeoutCall,
    isTokenValid,
    extractTokenId,
    isTokenRenewable,
    isTokenRevoked;

  const mockGlobals = {
    win: {},
    document: document,
    location: {
      href: 'http://foo.com/anthony/is/awesome',
      pathname: '/anthony/is/awesome',
      hash: ''
    }
  };
  const utilPath = buildSrcPath('util/utils');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    mockGlobals.document = document;
    mockGlobals.document.title = 'Utils tests';

    initMockRegistry({
      'utility/globals': mockGlobals,
      'utility/devices': {
        getZoomSizingRatio: () => {
          return 1;
        }
      },
      'lodash': _
    });

    splitPath = require(utilPath).splitPath;
    getPageKeywords = require(utilPath).getPageKeywords;
    getPageTitle = require(utilPath).getPageTitle;
    objectDifference = require(utilPath).objectDifference;
    cssTimeToMs = require(utilPath).cssTimeToMs;
    nowInSeconds = require(utilPath).nowInSeconds;
    base64encode = require(utilPath).base64encode;
    emailValid = require(utilPath).emailValid;
    referrerPolicyUrl = require(utilPath).referrerPolicyUrl;
    getEnvironment = require(utilPath).getEnvironment;
    cappedTimeoutCall = require(utilPath).cappedTimeoutCall;
    isTokenValid = require(utilPath).isTokenValid;
    extractTokenId = require(utilPath).extractTokenId;
    isTokenRenewable = require(utilPath).isTokenRenewable;
    isTokenRevoked = require(utilPath).isTokenRevoked;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('splitPath()', () => {
    it('should split a path with some typical separation', () => {
      expect(splitPath('/this/is/a-1-path.html'))
        .toEqual(' this is a 1 path');

      // %20 is ' ' urlencoded
      expect(splitPath('/this/is/a-1%20path.html'))
        .toEqual(' this is a 1 path');

      // %2E is '.' urlencoded
      expect(splitPath('/this/is/a-2%2Epath.html'))
        .toEqual(' this is a 2 path');

      // %2D is '-' urlencoded
      expect(splitPath('/this/is/a--2%2Dpath.php'))
        .toEqual(' this is a  2 path');

      expect(splitPath('/this/is/a-2-path.html'))
        .toEqual(' this is a 2 path');

      expect(splitPath('/this/is/a|2|path.html'))
        .toEqual(' this is a 2 path');

      expect(splitPath('!/thi$/is/1@-_path.html'))
        .toEqual('! thi$ is 1@  path');

      expect(splitPath('!/thi𝌆$/is/tchüss1@-_path.html'))
        .toEqual('! thi𝌆$ is tchüss1@  path');

      expect(splitPath('/resource/1'))
        .toEqual(' resource ');

      expect(splitPath('/resource/1.html'))
        .toEqual(' resource ');

      expect(splitPath('/resource/1/children'))
        .toEqual(' resource children');
    });

    describe('when there are \':\' or \'#\' characters in the path', () => {
      it('should strip them out and replace them with spaces', () => {
        expect(splitPath('/this:5/is/#a-2-path.html'))
          .toEqual(' this 5 is  a 2 path');

        expect(splitPath('/this/#/is/a|2|path:.html'))
          .toEqual(' this   is a 2 path ');
      });
    });
  });

  describe('getPageKeywords()', () => {
    let location;

    beforeEach(() => {
      location = mockGlobals.location;
      location.hash = '';
    });

    it('should return the pathname in the form of space seperated keywords', () => {
      expect(getPageKeywords())
        .toEqual('anthony is awesome');
    });

    it('should still return valid keywords with weird `#` urls', () => {
      location.pathname = '/';
      location.hash = '#/anthony/#/is/#/awesome';

      expect(getPageKeywords())
        .toEqual('anthony is awesome');

      location.pathname = '/fat/';
      location.hash = '#/cats';

      expect(getPageKeywords())
        .toEqual('fat cats');

      location.pathname = '/fred/';
      location.hash = '#bar';

      expect(getPageKeywords())
        .toEqual('fred bar');
    });

    it('should return valid keywords with \':\' characters in the url', () => {
      location.pathname = '/buy/page:5/hardcover:false';

      expect(getPageKeywords())
        .toEqual('buy page 5 hardcover false');

      location.pathname = '/:buy:/:page::5/hardcover:false:';

      expect(getPageKeywords())
        .toEqual('buy page 5 hardcover false');
    });

    it('ignores numeric keywords in the url', () => {
      location.pathname = '/buy/5/sell/5.html';

      expect(getPageKeywords())
        .toEqual('buy sell');
    });
  });

  describe('getPageTitle()', () => {
    it('returns the document.title', () => {
      expect(getPageTitle())
        .toEqual(document.title);
    });
  });

  describe('objectDifference', () => {
    let a, b;

    beforeEach(() => {
      a = {
        list: [],
        hello: 'world',
        bob: 'the builder'
      };
      b = {
        list: [],
        bob: 'the builder'
      };
    });

    describe('when there are no nested objects', () => {
      it('should return the complement of the two objects', () => {
        expect(objectDifference(a, b))
          .toEqual({ hello: 'world' });
      });
    });

    describe('when there are nested objects', () => {
      it('should return the complement of the two objects', () => {
        a.foo = { bar: 0, baz: 2 };
        a.extra = { a: 0, b: 1 };
        b.foo = { bar: 0, baz: 1 };

        expect(objectDifference(a, b))
          .toEqual({
            hello: 'world',
            foo: { baz: 2 },
            extra: { a: 0, b: 1 }
          });
      });
    });

    describe('when there are arrays', () => {
      it('should return the complement of the two objects without changing the arrays', () => {
        a.arr = [1, 2];
        b.arr = [2, 3];

        expect(objectDifference(a, b))
          .toEqual({ hello: 'world', arr: [1, 2] });
      });
    });
  });

  describe('cssTimeToMs()', () => {
    let cssTime;

    describe('when using seconds', () => {
      it('converts to milliseconds and returns an integer', () => {
        cssTime = '300s';
        expect(cssTimeToMs(cssTime)).toEqual(300 * 1000);
      });
    });

    describe('when using milliseconds', () => {
      it('returns an integer', () => {
        cssTime = '520ms';
        expect(cssTimeToMs(cssTime)).toEqual(520);
      });
    });

    describe('when given a malformed string', () => {
      describe('if it cannot parse the number', () => {
        it('falls back to 0', () => {
          cssTime = 'three hundred';
          expect(cssTimeToMs(cssTime)).toEqual(0);
        });
      });

      describe('if it can parse the number, but not the unit', () => {
        it('assumes milliseconds', () => {
          cssTime = '666somg';
          expect(cssTimeToMs(cssTime)).toEqual(666);
        });
      });
    });
  });

  describe('nowInSeconds()', () => {
    it('should return the current time in seconds', () => {
      expect(nowInSeconds())
        .toEqual(Math.floor(Date.now() / 1000));
    });
  });

  describe('base64encode()', () => {
    describe('with ascii characters', () => {
      const ascii = ''.concat(
        'abcdefghijklmnopqrstuvwxyz',
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        '0123456789',
        "!#$%&()*+,-./:;<=>?@[]{}^_`|~'\\\""
      );

      const base64 = ''.concat(
        'YWJjZGVmZ2hpamtsbW5vcHFyc3',
        'R1dnd4eXpBQkNERUZHSElKS0xN',
        'Tk9QUVJTVFVWV1hZWjAxMjM0NT',
        'Y3ODkhIyQlJigpKissLS4vOjs8',
        'PT4/QFtde31eX2B8fidcIg=='
      );

      it('encodes the string properly', () => {
        expect(base64encode(ascii))
          .toEqual(base64);
      });
    });

    describe('with extended utf-8 characters', () => {
      it('encodes the string properly', () => {
        expect(base64encode('✓ à la mode'))
          .toEqual('4pyTIMOgIGxhIG1vZGU=');

        expect(base64encode('我是一支鉛筆'))
          .toEqual('5oiR5piv5LiA5pSv6Ymb562G');

        expect(base64encode('Я карандаш'))
          .toEqual('0K8g0LrQsNGA0LDQvdC00LDRiA==');

        expect(base64encode('😂😓😥😭💩'))
          .toEqual('8J+YgvCfmJPwn5il8J+YrfCfkqk=');
      });
    });
  });

  describe('emailValid()', () => {
    const validEmails = [
      'x@x.x',
      'a/b@domain.com',
      'tu!!7n7.ad##0!!!@company.ca'
    ];
    const invalidEmails = [
      'x@x', // Is valid in some browsers but Zendesk doesn't handle them
      '',
      'hello.hi@hey',
      '123',
      '@something.com',
      'foo.bar',
      null,
      undefined,
      {},
      [],
      10000
    ];

    _.forEach(validEmails, (email) => it(`should return true for ${email}`, () => {
      expect(emailValid(email))
        .toEqual(true);
    }));

    _.forEach(invalidEmails, (email) => it(`should return false for ${email}`, () => {
      expect(emailValid(email))
        .toEqual(false);
    }));

    describe('when allowEmpty is true', () => {
      it('returns true for an empty string', () => {
        expect(emailValid('', { allowEmpty: true }))
          .toEqual(true);
      });
    });
  });

  describe('referrerPolicyUrl', () => {
    const url = 'http://www.example.com/path/page.html';

    describe('when referrerPolicy is false', () => {
      it('returns the url', () => {
        expect(referrerPolicyUrl(false, url))
          .toEqual(url);
      });
    });

    describe("when referrerPolicy is 'no-referrer'", () => {
      it('returns null', () => {
        expect(referrerPolicyUrl('no-referrer', url))
          .toEqual(null);
      });
    });

    describe("when referrerPolicy is 'same-origin'", () => {
      it('returns null', () => {
        expect(referrerPolicyUrl('same-origin', url))
          .toEqual(null);
      });
    });

    describe("when referrerPolicy is 'origin'", () => {
      it('returns the url origin', () => {
        expect(referrerPolicyUrl('origin', url))
          .toEqual('http://www.example.com');
      });
    });

    describe("when referrerPolicy is 'origin-when-cross-origin'", () => {
      it('returns the url origin', () => {
        expect(referrerPolicyUrl('origin-when-cross-origin', url))
          .toEqual('http://www.example.com');
      });
    });

    describe("when referrerPolicy is 'strict-origin'", () => {
      it('returns the url origin', () => {
        expect(referrerPolicyUrl('strict-origin', url))
          .toEqual('http://www.example.com');
      });
    });

    describe("when referrerPolicy is 'strict-origin-when-cross-origin'", () => {
      it('returns the url origin', () => {
        expect(referrerPolicyUrl('strict-origin-when-cross-origin', url))
          .toEqual('http://www.example.com');
      });
    });
  });

  describe('#getEnvironment', () => {
    describe('when main.js is injected onto the document', () => {
      describe('when the asset source does not include zd-staging', () => {
        beforeEach(() => {
          document.write(`<script
            id="js-iframe-async"
            src="assets.zendesk.com"></script>`);
        });

        it('should return production', () => {
          expect(getEnvironment())
            .toEqual('production');
        });
      });

      describe('when the asset source includes zd-staging', () => {
        beforeEach(() => {
          document.write(`<script
            id="js-iframe-async"
            src="assets.zd-staging.com"></script>`);
        });

        it('should return staging', () => {
          expect(getEnvironment())
            .toEqual('staging');
        });
      });
    });

    describe('when main.js is not injected', () => {
      it('should return production', () => {
        expect(getEnvironment())
          .toEqual('production');
      });
    });
  });

  describe('#cappedTimeoutCall', () => {
    let callback;
    const delay = 10;
    const repetitions = 10;

    beforeEach(() => {
      jasmine.clock().install();
    });

    describe('when callback returns true', () => {
      beforeEach(() => {
        callback = jasmine.createSpy().and.returnValue(true);

        cappedTimeoutCall(callback, delay, repetitions);
        jasmine.clock().tick(100);
      });

      it('should call callback once', () => {
        expect(callback.calls.count())
          .toEqual(1);
      });
    });

    describe('when callback returns false', () => {
      beforeEach(() => {
        callback = jasmine.createSpy().and.returnValue(false);

        cappedTimeoutCall(callback, delay, repetitions);
        jasmine.clock().tick(100);
      });

      it(`should keep calling callback until ${repetitions} repetitions`, () => {
        expect(callback.calls.count())
          .toEqual(repetitions);
      });
    });
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

  describe('isTokenRevoked', () => {
    let result,
      token,
      revokedAt;

    beforeEach(() => {
      result = isTokenRevoked(token, revokedAt);
    });

    describe('when token is revoked', () => {
      beforeAll(() => {
        token = {
          createdAt: Math.floor(Date.now() / 1000)
        };
        revokedAt = Math.floor(Date.now() / 1000) + 5;
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when token is not revoked', () => {
      beforeAll(() => {
        token = {
          createdAt: Math.floor(Date.now() / 1000)
        };
        revokedAt = Math.floor(Date.now() / 1000) - 5;
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
