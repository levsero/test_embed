import { waitFor } from '@testing-library/dom'
import { publicApi, tracker } from '@zendesk/widget-shared-services'
import { beacon } from '@zendesk/widget-shared-services/beacon'
import setupIframe from '@zendesk/widget-shared-services/util/setup-iframe'
import * as boot from 'messengerSrc/boot'
import messenger from '../..'

jest.mock('@zendesk/widget-shared-services/util/setup-iframe')
jest.mock('@zendesk/widget-shared-services/feature-flags')
jest.mock('messengerSrc/boot')
jest.mock('messengerSrc/public-api')
jest.mock('@zendesk/widget-shared-services/errorTracker')
jest.mock('@zendesk/widget-shared-services/beacon')

jest.mock('@zendesk/widget-shared-services', () => {
  const originalModule = jest.requireActual('@zendesk/widget-shared-services')

  return {
    __esModule: true,
    ...originalModule,

    publicApi: {
      run: jest.fn(),
    },
    tracker: {
      ...originalModule.tracker,
      init: jest.fn(),
    },
  }
})

const runMessengerStart = async (config, configLoadEnd) => {
  return await messenger.start(config, configLoadEnd)
}

const expectToBeCalledBefore = (mockFunction1, mockFunction2) => {
  expect(mockFunction1.mock.invocationCallOrder[0]).toBeLessThan(
    mockFunction2.mock.invocationCallOrder[0]
  )
}

describe('start', () => {
  const mockMessengerConfig = {}
  const expectedServiceData = {
    config: mockMessengerConfig,
    embeddableName: 'messenger',
    localeData: {
      clientLocale: 'en-us',
      rawClientLocale: 'en-US',
      rawServerLocale: undefined,
      serverLocale: 'en-us',
    },
  }
  it('initialises the iframe to respects the referrer policy of host page', async () => {
    await runMessengerStart(mockMessengerConfig, 123)

    await waitFor(() => expect(setupIframe).toHaveBeenCalled())
  })

  it('initialises all framework services that have an init function with the same values', async () => {
    await runMessengerStart(mockMessengerConfig, 123)

    expect(beacon.init).toHaveBeenCalledWith(expectedServiceData)
    expect(tracker.init).toHaveBeenCalledWith(expectedServiceData)
  })

  it('sends a page view blip for the messenger', async () => {
    await runMessengerStart(mockMessengerConfig, 123)

    expect(beacon.sendPageView).toHaveBeenCalledWith('web_messenger')
  })

  it('runs all framework services that have a run function', async () => {
    await runMessengerStart(mockMessengerConfig, 123)

    expect(publicApi.run).toHaveBeenCalledWith(expectedServiceData)
  })

  it('initialises all framework services that have an init function with the same values', async () => {
    await runMessengerStart(mockMessengerConfig, 123)

    expect(beacon.init).toHaveBeenCalledWith(expectedServiceData)
    expect(tracker.init).toHaveBeenCalledWith(expectedServiceData)
  })

  it('boots the embeddable in the expected order', async () => {
    await runMessengerStart(mockMessengerConfig, 123)

    // inits services before embeddable
    expectToBeCalledBefore(beacon.init, boot.init)

    // inits embeddable before services run
    expectToBeCalledBefore(boot.init, publicApi.run)

    // runs services before running embeddable
    expectToBeCalledBefore(publicApi.run, boot.run)
  })

  it('sends init time blip 10% of the time', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.08)

    await runMessengerStart({}, 123)

    expect(beacon.sendWidgetInitInterval).toHaveBeenCalled()
  })

  it('does not send init time blip 90% of the time', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(22)

    await runMessengerStart(mockMessengerConfig, 123)

    expect(beacon.sendWidgetInitInterval).not.toHaveBeenCalled()
  })

  it('initialises the messenger', async () => {
    await runMessengerStart(mockMessengerConfig)

    expect(boot.init).toHaveBeenCalledWith(expectedServiceData)
  })

  it('runs the messenger', async () => {
    await runMessengerStart(mockMessengerConfig)

    expect(boot.run).toHaveBeenCalledWith(expectedServiceData)
  })

  it('sends a page view blip for the web widget', async () => {
    await runMessengerStart(mockMessengerConfig)

    expect(beacon.sendPageView).toHaveBeenCalledWith('web_messenger')
  })
})
