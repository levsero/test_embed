import { waitFor } from '@testing-library/dom'
import { fetchEmbeddableConfig } from 'src/framework/api/embeddableConfig'
import { isBlacklisted } from 'utility/devices'
import errorTracker from 'src/framework/services/errorTracker'
import * as globals from 'utility/globals'
import framework from '../index'
import { beacon } from 'service/beacon'
import tracker from 'service/tracker'
import messenger from 'src/apps/messenger'
import webWidget from 'src/apps/webWidget'
import publicApi from 'src/framework/services/publicApi'

jest.mock('src/framework/api/embeddableConfig')
jest.mock('utility/devices')
jest.mock('src/framework/services/errorTracker')
jest.mock('service/beacon')
jest.mock('src/framework/services/publicApi')
jest.mock('service/tracker')
jest.mock('src/apps/messenger')
jest.mock('src/apps/webWidget')

describe('setupIframe', () => {
  let mockComputedStyle = {},
    mockDoc = {
      documentElement: {}
    }

  beforeEach(() => {
    jest.spyOn(window, 'getComputedStyle').mockImplementation(() => mockComputedStyle)
    jest.spyOn(globals, 'setReferrerMetas').mockImplementation(() => {})
  })

  afterEach(() => {
    window.getComputedStyle.mockRestore()
    globals.setReferrerMetas.mockRestore()
  })

  describe('when Iframe is provied', () => {
    beforeEach(() => {
      framework.setupIframe({}, mockDoc)
    })

    it('expect setReferrerMetas to have been called', () => {
      expect(globals.setReferrerMetas).toHaveBeenCalled()
    })
  })

  describe('when Iframe has not been provided', () => {
    beforeEach(() => {
      framework.setupIframe(null, mockDoc)
    })

    it('expect setReferrerMetas not to have been called', () => {
      expect(globals.setReferrerMetas).not.toHaveBeenCalled()
    })
  })
})

describe('start', () => {
  const mockMessengerConfig = {
    messenger: {}
  }
  const mockWebWidgetConfig = {}

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(123)
  })

  it('does not boot if the end user is blacklisted', () => {
    isBlacklisted.mockReturnValueOnce(true)

    framework.start()

    expect(fetchEmbeddableConfig).not.toHaveBeenCalled()
  })

  it('does not boot if window.zESkipWebWidget is true', () => {
    window.zESkipWebWidget = true

    framework.start()

    expect(fetchEmbeddableConfig).not.toHaveBeenCalled()
    window.zESkipWebWidget = false
  })

  it('initialises the iframe to respects the referrer policy of host page', async () => {
    framework.setupIframe = jest.fn()

    await framework.start()

    await waitFor(() => expect(framework.setupIframe).toHaveBeenCalled())
  })

  it('logs an error to rollbar when failed to fetch embeddable config', async () => {
    const mockError = new Error('Network error')

    fetchEmbeddableConfig.mockImplementation(() => {
      throw mockError
    })

    await framework.start()

    expect(errorTracker.error).toHaveBeenCalledWith(mockError, {
      rollbarFingerprint: 'Failed to render embeddable',
      rollbarTitle: 'Failed to render embeddable'
    })
  })

  it('initialises all framework services that have an init function with the same values', async () => {
    fetchEmbeddableConfig.mockReturnValue(mockMessengerConfig)

    await framework.start()

    const expectedServiceData = {
      config: mockMessengerConfig,
      configLoadStart: Date.now(),
      embeddableName: 'messenger'
    }

    expect(beacon.init).toHaveBeenCalledWith(expectedServiceData)
    expect(tracker.init).toHaveBeenCalledWith(expectedServiceData)
  })

  it('runs all framework services that have a run function', async () => {
    fetchEmbeddableConfig.mockReturnValue(mockMessengerConfig)

    await framework.start()

    const expectedServiceData = {
      config: mockMessengerConfig,
      configLoadStart: Date.now(),
      embeddableName: 'messenger'
    }

    expect(publicApi.run).toHaveBeenCalledWith(expectedServiceData)
  })

  // Simple helper function to check that mockFunction1 was called before mockFunction2
  const expectToBeCalledBefore = (mockFunction1, mockFunction2) => {
    expect(mockFunction1.mock.invocationCallOrder[0]).toBeLessThan(
      mockFunction2.mock.invocationCallOrder[0]
    )
  }

  it('boots the embeddable in the expected order', async () => {
    fetchEmbeddableConfig.mockReturnValue(mockMessengerConfig)

    await framework.start()

    // inits services before embeddable
    expectToBeCalledBefore(beacon.init, messenger.init)

    // inits embeddable before services run
    expectToBeCalledBefore(messenger.init, publicApi.run)

    // runs services before running embeddable
    expectToBeCalledBefore(publicApi.run, messenger.run)
  })

  it('sends init time blip 10% of the time', async () => {
    fetchEmbeddableConfig.mockReturnValue(mockMessengerConfig)

    jest.spyOn(Math, 'random').mockReturnValue(0.08)

    await framework.start()

    expect(beacon.sendWidgetInitInterval).toHaveBeenCalled()
  })

  it('does not send init time blip 90% of the time', async () => {
    fetchEmbeddableConfig.mockReturnValue(mockMessengerConfig)

    jest.spyOn(Math, 'random').mockReturnValue(22)

    await framework.start()

    expect(beacon.sendWidgetInitInterval).not.toHaveBeenCalled()
  })

  describe('when config is for the messenger', () => {
    it('initialises the messenger', async () => {
      fetchEmbeddableConfig.mockReturnValue(mockMessengerConfig)

      await framework.start()

      expect(messenger.init).toHaveBeenCalledWith({
        config: mockMessengerConfig,
        configLoadStart: Date.now(),
        embeddableName: 'messenger'
      })
    })

    it('runs the messenger', async () => {
      fetchEmbeddableConfig.mockReturnValue(mockMessengerConfig)

      await framework.start()

      expect(messenger.run).toHaveBeenCalledWith({
        config: mockMessengerConfig,
        configLoadStart: Date.now(),
        embeddableName: 'messenger'
      })
    })

    it('sends a page view blip for the messenger', async () => {
      fetchEmbeddableConfig.mockReturnValue(mockMessengerConfig)

      await framework.start()

      expect(beacon.sendPageView).toHaveBeenCalledWith('web_messenger')
    })
  })

  describe('when config is for the web widget', () => {
    it('initialises the web widget', async () => {
      fetchEmbeddableConfig.mockReturnValue(mockWebWidgetConfig)

      await framework.start()

      expect(webWidget.init).toHaveBeenCalledWith({
        config: mockWebWidgetConfig,
        configLoadStart: Date.now(),
        embeddableName: 'webWidget'
      })
    })

    it('runs the web widget', async () => {
      fetchEmbeddableConfig.mockReturnValue(mockWebWidgetConfig)

      await framework.start()

      expect(webWidget.run).toHaveBeenCalledWith({
        config: mockWebWidgetConfig,
        configLoadStart: Date.now(),
        embeddableName: 'webWidget'
      })
    })

    it('sends a page view blip for the web widget', async () => {
      fetchEmbeddableConfig.mockReturnValue(mockWebWidgetConfig)

      await framework.start()

      expect(beacon.sendPageView).toHaveBeenCalledWith('web_widget')
    })
  })
})
