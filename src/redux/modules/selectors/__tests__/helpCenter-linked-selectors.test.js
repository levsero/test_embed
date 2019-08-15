import * as selectors from '../helpCenter-linked-selectors'

describe('getHasPassedAuth', () => {
  const setup = (isAuthenticated = false, signInRequired = false, helpCenterPage = false) => {
    return selectors.getHasPassedAuth.resultFunc(isAuthenticated, signInRequired, helpCenterPage)
  }

  it('returns true when isAuthenticated is set to true', () => {
    const result = setup(true, true)

    expect(result).toEqual(true)
  })

  it('returns true when helpCenterSignInRequired is set to false', () => {
    const result = setup()

    expect(result).toEqual(true)
  })

  it('returns true when isOnHelpCenterPage is set to true', () => {
    const result = setup(false, true, true)

    expect(result).toEqual(true)
  })

  it('returns false when signInRequired is set to true and not authenticated or on HC page', () => {
    const result = setup(false, true)

    expect(result).toEqual(false)
  })
})
