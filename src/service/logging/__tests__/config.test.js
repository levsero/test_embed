import _ from 'lodash';
import {
  errorMessageBlacklist,
  hostBlackList,
  checkIgnoreFn
} from '../config';

describe('hostBlackList', () => {
  const regex = () => new RegExp(hostBlackList[0]);

  describe('when the trace contains patterns to blacklist', () => {
    const traceList = [
      'File https://www.betabrand.com/angular/bower_components/tinymce/tinymce.min.js line 2 col 13017 in m',
      'File "webpack-internal:///./node_modules/component-emitter/index.js" line 133 col 20 in Request.Emitter.emit',
      'File https://v2.zopim.com/ line 7462 col 1 in t.exports</m.increment'
    ];

    it('has at least one entry', () => {
      expect(traceList.length)
        .toBeGreaterThan(0);
    });

    it('returns true for all patterns', () => {
      traceList.forEach((pattern) => {
        expect(regex().test(pattern))
          .toEqual(true);
      });
    });
  });

  describe('when the trace contains patterns that should not be blacklisted', () => {
    const traceList = [
      'File https://assets.zendesk.com/embeddable_framework/main.js line 51 col 1060096 in render/</</<',
      'https://static.zdassets.com/web_widget/00b4ca1a169d2dc52a34f2938e7280039c621394/web_widget.js',
      'https://static-staging.zdassets.com/ekr/asset_composer.js?key=7144da5b-c5f6-4e4a-8e14-3db3d8404d35',
      'assets.zd-staging.com/embeddable_framework/webWidgetPreview.js'
    ];

    it('has at least one entry', () => {
      expect(traceList.length)
        .toBeGreaterThan(0);
    });

    it('returns false for all patterns', () => {
      traceList.forEach((pattern) => {
        expect(regex().test(pattern))
          .toEqual(false);
      });
    });
  });
});

describe('errorMessageBlacklist', () => {
  let patternList;

  const accessControl = {
    pattern: 'Access-Control-Allow-Origin',
    validStrings: [
      'Access-Control-Allow-Origin',
      '\'Access-Control-Allow-Origin\' header is present on the requested resource. ' +
      'Origin \'foo.com\' is therefore not allowed access'
    ],
    invalidStrings: [
      'access-control-allow-origin',
      123
    ]
  };
  const timeoutExceeded = {
    pattern: 'timeout of [0-9]+ms exceeded',
    validStrings: [
      'timeout of 312ms exceeded',
      'timeout of 9001ms exceeded',
      'timeout of 1ms exceeded'
    ],
    invalidStrings: [
      'timeout of ms exceeded',
      'timeout of -1ms exceeded'
    ]
  };
  const scriptError = {
    pattern: /^(.)*(Script error).?$/,
    validStrings: [
      '(unknown): Script error',
      '(unknown): Script error.',
      'Script error.',
      'Script error'
    ],
    invalidStrings: [
      '(unknown): ',
      '(unknown): .',
      'script error'
    ]
  };
  const maxItems = {
    pattern: 'maxItems has been hit, ignoring errors until reset.',
    validStrings: [
      'maxItems has been hit, ignoring errors until reset.'
    ]
  };
  const crossOriginPropertyAccess = {
    pattern: /Permission denied to access property "(.)+" on cross-origin object/,
    validStrings: [
      'Permission denied to access property "helpCenter" on cross-origin object',
      'Permission denied to access property "max-height" on cross-origin object',
      'Permission denied to access property "d_br@dfords0n1337-420.....blaze itttt" on cross-origin object'
    ]
  };

  const blacklistedErrors = [accessControl, timeoutExceeded, scriptError, maxItems, crossOriginPropertyAccess];

  const patternExistSpec = (pattern) => {
    it('exists in pattern list', () => {
      const mapFn = (pattern) => pattern.toString();
      const result = _.chain(patternList)
        .map(mapFn)
        .indexOf(pattern.toString())
        .value();

      expect(result)
        .not.toEqual(-1);
    });
  };
  const patternValidatorSpec = (pattern, strings, expectation = true) => {
    const regexp = new RegExp(pattern);

    strings.forEach((string) => {
      it(`should return ${expectation}`, () => {
        expect(regexp.test(string))
          .toBe(expectation);
      });
    });
  };

  beforeEach(() => {
    patternList = errorMessageBlacklist;
  });

  it('tests at least 1 element', () => {
    expect(_.size(blacklistedErrors))
      .toBeGreaterThan(0);
  });

  blacklistedErrors.forEach((blacklistedError) => {
    const { pattern, validStrings, invalidStrings = [] } = blacklistedError;

    describe(`${pattern}`, () => {
      patternExistSpec(pattern);

      describe('when error strings are valid', () => {
        patternValidatorSpec(pattern, validStrings, true);
      });

      describe('when error strings are invalid', () => {
        patternValidatorSpec(pattern, invalidStrings, false);
      });
    });
  });
});

describe('checkIgnoreFn', () => {
  let result,
    mockArgs;

  beforeEach(() => {
    const isUncaught = false; // Ignored argument

    result =checkIgnoreFn(isUncaught, mockArgs);
  });

  describe('when a message matches the script error pattern', () => {
    beforeAll(() => {
      const error = new Error('Script error.');

      mockArgs = [error.toString()];
    });

    it('returns true', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('when a message does not match the script error pattern', () => {
    beforeAll(() => {
      const error = new Error('Terence error.');

      mockArgs = [error.toString()];
    });

    it('returns false', () => {
      expect(result)
        .toEqual(false);
    });
  });
});
