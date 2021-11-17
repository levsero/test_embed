import { isRequestFromLivePreview } from 'src/framework/api/embeddableConfig'
import { win } from 'src/util/globals'

describe('isRequestFromLivePreview', () => {
  const mockHost = (host) => {
    return { host }
  }
  let hostSpy

  beforeEach(() => {
    hostSpy = jest.spyOn(win, 'location', 'get')
  })

  afterEach(() => {
    hostSpy.mockRestore()
    delete win.zESettings
  })

  describe('when origin is admin using live previewer', () => {
    describe('when admin has opted into preview', () => {
      it('returns true', () => {
        win.zESettings = { preview: true }
        hostSpy.mockImplementation(() => mockHost('static-staging.zdassets.com'))
        expect(isRequestFromLivePreview()).toEqual(true)
      })
    })

    describe('when admin has not opted into preview', () => {
      describe('when explicitly opted out', () => {
        it('returns false', () => {
          win.zESettings = { preview: false }
          hostSpy.mockImplementation(() => mockHost('static-staging.zdassets.com'))
          expect(isRequestFromLivePreview()).toEqual(false)
        })
      })

      describe('when preview in zESettings is not defined', () => {
        it('returns false', () => {
          win.zESettings = {}
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
        win.zESettings = { preview: true }
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
