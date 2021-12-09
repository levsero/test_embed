import { fetchEmbeddableConfig, isRequestFromLivePreview } from 'src/framework/api/embeddableConfig'

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

describe('fetchEmbeddableConfig', () => {
  beforeEach(() => {
    document.zendeskHost = 'testing.zendesk.com'
    window.fetch = jest.fn().mockImplementation(async () => ({
      status: 200,
      json: async () => ({ embeddable: 'config' }),
    }))
  })

  it('installs the fetch polyfill if fetch is not available in the browser', async () => {
    delete window.fetch
    document.zendeskHost = 'testing.zendesk.com'
    try {
      await fetchEmbeddableConfig()
    } catch {}
    expect(window.fetch).toBeTruthy()
  })

  it('throws an error if zendeskHost is not defined', async () => {
    document.zendeskHost = undefined
    await expect(fetchEmbeddableConfig()).rejects.toThrowError('Missing zendeskHost config param.')
  })

  it('throws an error if the status is not 200', async () => {
    window.fetch = jest.fn().mockImplementation(async () => ({ status: 400 }))
    await expect(fetchEmbeddableConfig()).rejects.toThrowError('Failed to fetch config')
  })

  it('returns the embeddable config', async () => {
    await expect(fetchEmbeddableConfig()).resolves.toEqual({ embeddable: 'config' })
  })

  it('fetches the embeddable config if not on the live preview page', async () => {
    await fetchEmbeddableConfig()
    expect(window.fetch).toHaveBeenCalledWith('https://testing.zendesk.com/embeddable/config')
  })

  it('fetches a fake embeddable config if on the live preview page', async () => {
    jest
      .spyOn(window, 'location', 'get')
      .mockImplementation(() => ({ host: 'static-staging.zdassets.com' }))
    window.zESettings = { preview: true }

    await fetchEmbeddableConfig()
    expect(window.fetch).toHaveBeenCalledWith(
      'https://testing.zendesk.com/embeddable/preview/config'
    )
  })
})
