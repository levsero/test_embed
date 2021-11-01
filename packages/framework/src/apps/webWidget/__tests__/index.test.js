import { waitFor } from '@testing-library/dom'
import webWidget from 'src/apps/webWidget'
import * as boot from 'src/apps/webWidget/boot'
import publicApi from 'src/framework/services/publicApi'
import setupIframe from 'src/framework/setupIframe'
import { beacon } from 'src/service/beacon'
import tracker from 'src/service/tracker'

jest.mock('src/framework/setupIframe')
jest.mock('src/service/beacon')
jest.mock('src/service/tracker')
jest.mock('src/framework/services/publicApi')
jest.mock('src/embeds/webWidget/selectors/feature-flags')
jest.mock('src/apps/webWidget/boot')

const runWidgetStart = async (config, configLoadEnd) => {
  return await webWidget.start(config, configLoadEnd)
}

const expectToBeCalledBefore = (mockFunction1, mockFunction2) => {
  expect(mockFunction1.mock.invocationCallOrder[0]).toBeLessThan(
    mockFunction2.mock.invocationCallOrder[0]
  )
}

describe('start', () => {
  const mockWidgetConfig = {}
  const expectedServiceData = {
    config: mockWidgetConfig,
    embeddableName: 'webWidget',
  }
  it('initialises the iframe to respects the referrer policy of host page', async () => {
    await runWidgetStart(mockWidgetConfig, 123)

    await waitFor(() => expect(setupIframe).toHaveBeenCalled())
  })

  it('initialises all framework services that have an init function with the same values', async () => {
    await runWidgetStart(mockWidgetConfig, 123)

    expect(beacon.init).toHaveBeenCalledWith(expectedServiceData)
    expect(tracker.init).toHaveBeenCalledWith(expectedServiceData)
  })

  it('sends a page view blip for the widget', async () => {
    await runWidgetStart(mockWidgetConfig, 123)

    expect(beacon.sendPageView).toHaveBeenCalledWith('web_widget')
  })

  it('runs all framework services that have a run function', async () => {
    await runWidgetStart(mockWidgetConfig, 123)

    expect(publicApi.run).toHaveBeenCalledWith(expectedServiceData)
  })

  it('initialises all framework services that have an init function with the same values', async () => {
    await runWidgetStart(mockWidgetConfig, 123)

    expect(beacon.init).toHaveBeenCalledWith(expectedServiceData)
    expect(tracker.init).toHaveBeenCalledWith(expectedServiceData)
  })

  it('boots the embeddable in the expected order', async () => {
    await runWidgetStart(mockWidgetConfig, 123)

    // inits services before embeddable
    expectToBeCalledBefore(beacon.init, boot.init)

    // inits embeddable before services run
    expectToBeCalledBefore(boot.init, publicApi.run)

    // runs services before running embeddable
    expectToBeCalledBefore(publicApi.run, boot.run)
  })

  it('sends init time blip 10% of the time', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.08)

    jest.spyOn(beacon, 'sendWidgetInitInterval')

    await runWidgetStart({}, 123)

    expect(beacon.sendWidgetInitInterval).toHaveBeenCalled()
  })

  it('does not send init time blip 90% of the time', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(22)

    await runWidgetStart(mockWidgetConfig, 123)

    expect(beacon.sendWidgetInitInterval).not.toHaveBeenCalled()
  })

  it('initialises the messenger', async () => {
    await runWidgetStart(mockWidgetConfig)

    expect(boot.init).toHaveBeenCalledWith(expectedServiceData)
  })

  it('runs the messenger', async () => {
    await runWidgetStart(mockWidgetConfig)

    expect(boot.run).toHaveBeenCalledWith(expectedServiceData)
  })

  it('sends a page view blip for the web widget', async () => {
    await runWidgetStart()

    expect(beacon.sendPageView).toHaveBeenCalledWith('web_widget')
  })
})
