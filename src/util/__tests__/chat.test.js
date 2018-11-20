import _ from 'lodash';
import {
  isDefaultNickname,
  isAgent
} from '../chat';

describe('isDefaultNickname', () => {
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

  _.forEach(validNames, (name) => it(`returns true for ${name}`, () => {
    expect(isDefaultNickname(name))
      .toEqual(true);
  }));

  _.forEach(invalidNames, (name) => it(`returns false for ${name}`, () => {
    expect(isDefaultNickname(name))
      .toEqual(false);
  }));
});

describe('isAgent', () => {
  describe('when nick is agent:123', () => {
    it('returns true', () => {
      const result = isAgent('agent:123');

      expect(result)
        .toEqual(true);
    });
  });

  describe('when nick is agent bot', () => {
    it('returns false', () => {
      const result = isAgent('agent:trigger');

      expect(result)
        .toEqual(false);
    });
  });

  describe('when nick is visitor', () => {
    it('returns false', () => {
      const result = isAgent('visitor');

      expect(result)
        .toEqual(false);
    });
  });
});
