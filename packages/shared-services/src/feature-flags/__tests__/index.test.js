import isFeatureEnabled from 'src/feature-flags'
import inDebugMode from 'src/util/in-debug-mode'
import features from '../features'

jest.mock('src/util/in-debug-mode', () => jest.fn())

jest.mock('../features', () => ({
  fancyFeature: {
    defaultValue: true,
    getArturoValue: jest.fn(),
  },
}))

describe('isFeatureEnabled', () => {
  afterEach(() => {
    features.fancyFeature.getArturoValue.mockReset()
    delete localStorage['ZD-feature-fancyFeature']
  })

  describe('local overrides', () => {
    describe('when not in debug or dev mode', () => {
      beforeEach(() => {
        inDebugMode.mockReturnValueOnce(false)
      })

      it('does not allow you to override the value for the feature flag', () => {
        features.fancyFeature.getArturoValue.mockReturnValueOnce(false)
        localStorage['ZD-feature-fancyFeature'] = true

        expect(isFeatureEnabled('fancyFeature')).toBe(false)
      })
    })

    describe('when in debug or dev mode', () => {
      beforeEach(() => {
        inDebugMode.mockReturnValueOnce(true)
      })

      it('allows you to turn the feature on via local storage', () => {
        features.fancyFeature.getArturoValue.mockReturnValueOnce(false)
        localStorage['ZD-feature-fancyFeature'] = true

        expect(isFeatureEnabled('fancyFeature')).toBe(true)
      })

      it('allows you to turn the feature off via local storage', () => {
        features.fancyFeature.getArturoValue.mockReturnValueOnce(true)
        localStorage['ZD-feature-fancyFeature'] = false

        expect(isFeatureEnabled('fancyFeature')).toBe(false)
      })

      it('uses the arturo value if not overridden', () => {
        features.fancyFeature.getArturoValue.mockReturnValueOnce(true)
        delete localStorage['ZD-feature-fancyFeature']

        expect(isFeatureEnabled('fancyFeature')).toBe(true)
      })
    })
  })

  it('returns true if the feature is enabled', () => {
    features.fancyFeature.getArturoValue.mockReturnValue(true)
    expect(isFeatureEnabled('fancyFeature')).toBe(true)
  })

  it('returns false if the feature is disabled', () => {
    features.fancyFeature.getArturoValue.mockReturnValue(false)
    expect(isFeatureEnabled('fancyFeature')).toBe(false)
  })

  it('returns false if the feature is not defined in the features.js file', () => {
    expect(isFeatureEnabled('notDefinedInFeaturesFile')).toBe(false)
  })
})
