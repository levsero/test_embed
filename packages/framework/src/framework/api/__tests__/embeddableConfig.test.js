import { isRequestFromLivePreview } from 'src/framework/api/embeddableConfig'

describe('isRequestFromLivePreview', () => {
  const mockHost = (host, optInData) => {
    return { ...optInData, location: { host } }
  }
  let windowSpy

  beforeEach(() => {
    windowSpy = jest.spyOn(global, 'window', 'get')
  })

  afterEach(() => {
    windowSpy.mockRestore()
  })

  describe('when origin is admin using live previewer', () => {
    describe('when admin has opted into preview', () => {
      it('returns true', () => {
        const optInData = { zESettings: { preview: true } }
        windowSpy.mockImplementation(() => mockHost('static-staging.zdassets.com', optInData))
        expect(isRequestFromLivePreview()).toEqual(true)
      })
    })

    describe('when admin has not opted into preview', () => {
      describe('when explicitly opted out', () => {
        it('returns false', () => {
          const optInData = { zESettings: { preview: false } }
          windowSpy.mockImplementation(() => mockHost('static-staging.zdassets.com', optInData))
          expect(isRequestFromLivePreview()).toEqual(false)
        })
      })

      describe('when preview in zESettings is not defined', () => {
        it('returns false', () => {
          const optInData = { zESettings: {} }
          windowSpy.mockImplementation(() => mockHost('static-staging.zdassets.com', optInData))
          expect(isRequestFromLivePreview()).toEqual(false)
        })
      })

      describe('when zESettings is not defined', () => {
        it('returns false', () => {
          const optInData = {}
          windowSpy.mockImplementation(() => mockHost('static-staging.zdassets.com', optInData))
          expect(isRequestFromLivePreview()).toEqual(false)
        })
      })
    })
  })

  describe('when origin is not admin using live previewer', () => {
    describe('when user has opted into preview', () => {
      it('returns false', () => {
        windowSpy.mockImplementation(() => mockHost('z3nmsrikumar.zendesk-staging.com', true))
        expect(isRequestFromLivePreview()).toEqual(false)
      })
    })

    describe('when user has not opted into preview', () => {
      it('returns false', () => {
        windowSpy.mockImplementation(() => mockHost('z3nmsrikumar.zendesk-staging.com', false))
        expect(isRequestFromLivePreview()).toEqual(false)
      })
    })
  })
})
