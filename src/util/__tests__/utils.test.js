import _ from 'lodash';
import {
  getPageKeywords,
  getPageTitle,
  cappedTimeoutCall,
  splitPath,
  base64encode,
  objectDifference,
  cssTimeToMs,
  nowInSeconds,
  nameValid,
  emailValid,
  referrerPolicyUrl,
  getEnvironment,
  isValidUrl
} from '../utils';
import { clearDOM } from 'utility/test_helpers';
import * as globals from 'utility/globals';

jest.useFakeTimers();

describe('isValidUrl', () => {
  it('returns true for valid urls', () => {
    const validUrls = [
      'https://www.example.com/arm/bottle.html',
      'https://www.example.com/',
      'http://example.com/apparatus/alarm#boundary',
      'http://www.example.com/bat?appliance=bee&berry=amusement',
      'http://example.edu/',
      'http://example.net/?brother=aftermath',
      'ftp://google.com'
    ];

    validUrls.forEach(url => {
      expect(isValidUrl(url))
        .toEqual(true);
    });
  });

  it('returns false for invalid urls', () => {
    const invalidUrls = [
      null,
      undefined,
      10,
      23.9,
      true,
      'noop',
      'hello.com',
      'localhost',
      'http//google',
      '255.255.255.255'
    ];

    invalidUrls.forEach(url => {
      expect(isValidUrl(url))
        .toEqual(false);
    });
  });
});

describe('splitPath()', () => {
  it('splits a path with some typical separation', () => {
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
    it('strips them out and replace them with spaces', () => {
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
    globals.location = {
      href: 'http://foo.com/anthony/is/awesome',
      pathname: '/anthony/is/awesome',
      hash: ''
    };
    location = globals.location;
  });

  it('returns the pathname in the form of space seperated keywords', () => {
    expect(getPageKeywords())
      .toEqual('anthony is awesome');
  });

  it('returns valid keywords with weird `#` urls', () => {
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

  it('returns valid keywords with \':\' characters in the url', () => {
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
    it('returns the complement of the two objects', () => {
      expect(objectDifference(a, b))
        .toEqual({ hello: 'world' });
    });
  });

  describe('when there are nested objects', () => {
    it('returns the complement of the two objects', () => {
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
    it('returns the complement of the two objects without changing the arrays', () => {
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
  it('returns the current time in seconds', () => {
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
    'bob@omg.co.uk',
    'a/b@domain.com',
    'tu!!7n7.ad##0!!!@company.ca'
  ];
  const invalidEmails = [
    'x@x.x',
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

  _.forEach(validEmails, (email) => it(`returns true for ${email}`, () => {
    expect(emailValid(email))
      .toEqual(true);
  }));

  _.forEach(invalidEmails, (email) => it(`returns false for ${email}`, () => {
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

describe('nameValid()', () => {
  const validNames = [
    'a'.repeat(255),
    'b',
    'xyz'
  ];
  const invalidNames = [
    'a'.repeat(256),
    '',
    123,
    undefined,
    null,
    {},
    []
  ];

  _.forEach(validNames, (name) => it(`returns true for ${name}`, () => {
    expect(nameValid(name))
      .toEqual(true);
  }));

  _.forEach(invalidNames, (name) => it(`returns false for ${name}`, () => {
    expect(nameValid(name))
      .toEqual(false);
  }));

  describe('when allowEmpty is true', () => {
    it('returns true for an empty string', () => {
      expect(nameValid('', { allowEmpty: true }))
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
  afterEach(() => {
    clearDOM();
  });

  describe('when main.js is injected onto the document', () => {
    describe('when the asset source does not include zd-staging', () => {
      beforeEach(() => {
        document.write(`<script
          id="js-iframe-async"
          src="assets.zendesk.com"></script>`);
      });

      it('returns production', () => {
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

      it('returns staging', () => {
        expect(getEnvironment())
          .toEqual('staging');
      });
    });
  });

  describe('when main.js is not injected', () => {
    it('returns production', () => {
      expect(getEnvironment())
        .toEqual('production');
    });
  });
});

describe('#cappedTimeoutCall', () => {
  let callback;
  const delay = 10;
  const repetitions = 10;

  describe('when callback returns true', () => {
    beforeEach(() => {
      callback = jest.fn(() => true);

      cappedTimeoutCall(callback, delay, repetitions);
      jest.advanceTimersByTime(100);
    });

    it('calls callback once', () => {
      expect(callback)
        .toHaveBeenCalledTimes(1);
    });
  });

  describe('when callback returns false', () => {
    beforeEach(() => {
      callback = jest.fn(() => false);

      cappedTimeoutCall(callback, delay, repetitions);
      jest.advanceTimersByTime(100);
    });

    it(`keeps calling callback until ${repetitions} repetitions`, () => {
      expect(callback)
        .toHaveBeenCalledTimes(repetitions);
    });
  });
});
