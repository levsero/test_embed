import _ from 'lodash'
import * as globals from 'utility/globals'
import {
  combineNumbers,
  formatSchedule,
  isDefaultNickname,
  isAgent,
  isVisitor,
  createChatPopoutWindow,
  getDisplayName,
} from '../chat'
import { i18n } from 'src/apps/webWidget/services/i18n'

jest.mock('utility/globals')

beforeEach(() => {
  globals.win = {
    open: jest.fn(),
    location: {
      hostname: 'abc.com',
    },
    btoa: (x) => x,
  }
  globals.getZendeskHost = () => 'a.zendesk.com'
})

describe('isDefaultNickname', () => {
  const validNames = [
    'Visitor 26681136',
    'Visitor 1234567890463274356726736476353276435674834747835746574647878372436573657847',
    'Visitor 000000',
  ]
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
    10000,
  ]

  _.forEach(validNames, (name) =>
    it(`returns true for ${name}`, () => {
      expect(isDefaultNickname(name)).toEqual(true)
    })
  )

  _.forEach(invalidNames, (name) =>
    it(`returns false for ${name}`, () => {
      expect(isDefaultNickname(name)).toEqual(false)
    })
  )
})

describe('isAgent', () => {
  describe('when nick is agent:123', () => {
    it('returns true', () => {
      const result = isAgent('agent:123')

      expect(result).toEqual(true)
    })
  })

  describe('when nick is agent bot', () => {
    it('returns false', () => {
      const result = isAgent('agent:trigger')

      expect(result).toEqual(false)
    })
  })

  describe('when nick is visitor', () => {
    it('returns false', () => {
      const result = isAgent('visitor')

      expect(result).toEqual(false)
    })
  })
})

describe('isVisitor', () => {
  describe('when nick is visitor:123', () => {
    it('returns true', () => {
      const result = isVisitor('visitor:123')

      expect(result).toEqual(true)
    })
  })

  describe('when nick is agent:123', () => {
    it('returns false', () => {
      const result = isVisitor('agent:123')

      expect(result).toEqual(false)
    })
  })
})

describe.each`
  input              | expected
  ${[1]}             | ${[1]}
  ${[1, 3]}          | ${[1, 3]}
  ${[1, 3, 4]}       | ${[1, [3, 4]]}
  ${[1, 2, 3]}       | ${[[1, 3]]}
  ${[1, 3, 4, 5, 6]} | ${[1, [3, 6]]}
  ${[1, 3, 4, 6]}    | ${[1, [3, 4], 6]}
  ${[1, 2, 4, 5, 7]} | ${[[1, 2], [4, 5], 7]}
  ${[1, 2, 4, 6, 7]} | ${[[1, 2], 4, [6, 7]]}
`('combineNumbers', ({ input, expected }) => {
  test(`when called with ${input} returns ${expected}`, () => {
    expect(combineNumbers(input)).toEqual(expected)
  })
})

describe('formatSchedule', () => {
  test('should work with no operating periods', () => {
    const input = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    }

    const expected = [
      {
        days: [[1, 7]],
        periods: [],
      },
    ]

    expect(formatSchedule(input)).toEqual(expected)
  })

  test('should be sorted by day, starting from Monday', () => {
    const input = {
      0: [],
      1: [{ start: 0, end: 1 }],
      2: [],
      3: [{ start: 0, end: 1 }],
      4: [],
      5: [],
      6: [],
    }

    const expected = [
      {
        days: [1, 3],
        periods: [{ start: 0, end: 1 }],
      },
      {
        days: [2, [4, 7]],
        periods: [],
      },
    ]

    expect(formatSchedule(input)).toEqual(expected)
  })

  test('should be sorted by day, even if some blocks have day ranges', () => {
    const input = {
      0: [{ start: 6, end: 7 }],
      1: [{ start: 0, end: 1 }],
      2: [],
      3: [],
      4: [{ start: 0, end: 1 }],
      5: [{ start: 3, end: 4 }],
      6: [{ start: 3, end: 4 }],
    }

    const expected = [
      {
        days: [1, 4],
        periods: [{ start: 0, end: 1 }],
      },
      {
        days: [[2, 3]],
        periods: [],
      },
      {
        days: [[5, 6]],
        periods: [{ start: 3, end: 4 }],
      },
      {
        days: [7],
        periods: [{ start: 6, end: 7 }],
      },
    ]

    expect(formatSchedule(input)).toEqual(expected)
  })

  test('should be work with multiple periods in a day', () => {
    const input = {
      0: [],
      1: [
        { start: 0, end: 1 },
        { start: 3, end: 4 },
      ],
      2: [],
      3: [],
      4: [{ start: 0, end: 1 }],
      5: [],
      6: [
        { start: 0, end: 1 },
        { start: 3, end: 4 },
      ],
    }

    const expected = [
      {
        days: [1, 6],
        periods: [
          { start: 0, end: 1 },
          { start: 3, end: 4 },
        ],
      },
      {
        days: [[2, 3], 5, 7],
        periods: [],
      },
      {
        days: [4],
        periods: [{ start: 0, end: 1 }],
      },
    ]

    expect(formatSchedule(input)).toEqual(expected)
  })
})

describe('createChatPopoutWindow', () => {
  it('creates the query string correctly', () => {
    jest.spyOn(i18n, 't').mockImplementation(() => 'WebWidgetLiveChat')
    createChatPopoutWindow('settings, 初期設定時の質問', 'machineId', 'defactoLanguage')

    const url =
      'https://static-staging.zdassets.com/web_widget/latest/liveChat.html?v=10#key=a.zendesk.com&settings=%22settings%2C%20%E5%88%9D%E6%9C%9F%E8%A8%AD%E5%AE%9A%E6%99%82%E3%81%AE%E8%B3%AA%E5%95%8F%22&mid=machineId&locale=defactoLanguage&title=WebWidgetLiveChat' // eslint-disable-line no-useless-escape

    expect(globals.win.open).toHaveBeenCalledWith(url, 'WebWidgetLiveChat', 'height=600,width=400')
  })
})

describe('getDisplayName', () => {
  it('returns fallback when name is default visitor name', () => {
    expect(getDisplayName('Visitor 1234', 'blah')).toEqual('blah')
  })

  it('returns name when it is not default visitor name', () => {
    expect(getDisplayName('bruce wayne', 'blah')).toEqual('bruce wayne')
  })
})
