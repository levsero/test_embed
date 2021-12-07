import { isRequestFromLivePreview } from 'src/framework/api/embeddableConfig'

describe('isRequestFromLivePreview', () => {
  const mockHost = (host) => {
    return { host }
  }
  let hostSpy

  beforeEach(() => {
    hostSpy = jest.spyOn(window, 'location', 'get')
  })

  afterEach(() => {
    hostSpy.mockRestore()
    delete window.zESettings
  })

  describe('when origin is admin using live previewer', () => {
    describe('when admin has opted into preview', () => {
      it('returns true', () => {
        window.zESettings = { preview: true }
        hostSpy.mockImplementation(() => mockHost('static-staging.zdassets.com'))
        expect(isRequestFromLivePreview()).toEqual(true)
      })
    })

    describe('when admin has not opted into preview', () => {
      describe('when explicitly opted out', () => {
        it('returns false', () => {
          window.zESettings = { preview: false }
          hostSpy.mockImplementation(() => mockHost('static-staging.zdassets.com'))
          expect(isRequestFromLivePreview()).toEqual(false)
        })
      })

      describe('when preview in zESettings is not defined', () => {
        it('returns false', () => {
          window.zESettings = {}
          hostSpy.mockImplementation(() => mockHost('static-staging.zdassets.com'))
          expect(isRequestFromLivePreview()).toEqual(false)
        })
      })

      describe('when zESettings is not defined', () => {
        it('returns false', () => {
          hostSpy.mockImplementation(() => mockHost('static-staging.zdassets.com'))
          expect(isRequestFromLivePreview()).toEqual(false)
        })
      })
    })
  })

  describe('when origin is not admin using live previewer', () => {
    describe('when user has opted into preview', () => {
      it('returns false', () => {
        window.zESettings = { preview: true }
        hostSpy.mockImplementation(() => mockHost('z3nmsrikumar.zendesk-staging.com'))
        expect(isRequestFromLivePreview()).toEqual(false)
      })
    })

    describe('when user has not opted into preview', () => {
      it('returns false', () => {
        hostSpy.mockImplementation(() => mockHost('z3nmsrikumar.zendesk-staging.com'))
        expect(isRequestFromLivePreview()).toEqual(false)
      })
    })
  })
})
