import parseLocale from '../parseLocale'

const expectedFallback = 'en-US'

describe('parseLocale', () => {
  it('returns a fallback locale if nothing is passed in', () => {
    expect(parseLocale()).toBe(expectedFallback)
  })

  it('reformats locale strings to match our locale map', () => {
    expect(parseLocale('EN-GB')).toBe('en-gb')
  })

  it('returns a fallback when the locale does not exist', () => {
    expect(parseLocale('en-zz')).toBe(expectedFallback)
  })

  describe('with a desired fallback', () => {
    it('returns the desired fallback when parsing the locale string fails', () => {
      expect(parseLocale('fails', 'en-gb')).toBe('en-gb')
    })

    it('returns a hard fallback if even the desired fallback does not exist in our locale map', () => {
      expect(parseLocale('fails', 'fails')).toBe(expectedFallback)
    })
  })
})
