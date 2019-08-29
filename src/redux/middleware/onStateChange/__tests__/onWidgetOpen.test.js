let baseSelectors = require('src/redux/modules/base/base-selectors')
let selectors = require('src/redux/modules/selectors')
let baseActions = require('src/redux/modules/base/base-actions')
let scrollHacks = require('utility/scrollHacks')
let onWidgetOpen = require('../onWidgetOpen').default
let devices = require('utility/devices')
let mediator = require('service/mediator').mediator

const dispatch = jest.fn()

beforeEach(() => {
  jest.resetModules()
  jest.useFakeTimers()

  onWidgetOpen = require('../onWidgetOpen').default
  devices = require('utility/devices')
  baseSelectors = require('src/redux/modules/base/base-selectors')
  selectors = require('src/redux/modules/selectors')
  baseActions = require('src/redux/modules/base/base-actions')
  scrollHacks = require('utility/scrollHacks')
  mediator = require('service/mediator').mediator

  jest.mock('service/mediator')
  jest.mock('utility/devices')
  jest.mock('src/redux/modules/base/base-actions')
  jest.mock('src/redux/modules/selectors')
  jest.mock('utility/scrollHacks')

  jest.spyOn(selectors, 'getWebWidgetVisible').mockImplementation(state => state)
  jest.spyOn(baseSelectors, 'getActiveEmbed').mockImplementation(() => 'helpCenter')
})

test('nothing happens when the active embed is zopim', () => {
  jest.spyOn(baseSelectors, 'getActiveEmbed').mockImplementation(() => 'zopimChat')

  onWidgetOpen(false, true, dispatch)

  expect(dispatch).not.toHaveBeenCalled()
})

describe('when widget visibility transitions from false to true', () => {
  it('dispatches updateWidgetShown with true', () => {
    onWidgetOpen(false, true, dispatch)

    expect(baseActions.updateWidgetShown).toHaveBeenCalledWith(true)
  })

  it('calls mobile functions when on mobile', () => {
    devices.isMobileBrowser.mockReturnValue(true)

    onWidgetOpen(false, true, dispatch)

    jest.runAllTimers()

    expect(scrollHacks.setWindowScroll).toHaveBeenCalledWith(0)
    expect(scrollHacks.setScrollKiller).toHaveBeenCalledWith(true)
    expect(devices.setScaleLock).toHaveBeenCalledWith(true)
    expect(devices.getZoomSizingRatio).toHaveBeenCalled()
  })

  it('does not call any mobile functions when on desktop', () => {
    onWidgetOpen(false, true, dispatch)

    jest.runAllTimers()

    expect(scrollHacks.setWindowScroll).not.toHaveBeenCalled()
    expect(scrollHacks.setScrollKiller).not.toHaveBeenCalled()
    expect(devices.setScaleLock).not.toHaveBeenCalled()
    expect(devices.getZoomSizingRatio).not.toHaveBeenCalled()
  })
})

describe('when widget visibility transitions from true to false', () => {
  it('dispatches updateWidgetShown with true', () => {
    onWidgetOpen(true, false, dispatch)

    expect(baseActions.updateWidgetShown).toHaveBeenCalledWith(false)
  })

  it('calls mobile functions when on mobile', () => {
    devices.isMobileBrowser.mockReturnValue(true)

    onWidgetOpen(true, false, dispatch)

    expect(scrollHacks.revertWindowScroll).toHaveBeenCalled()
    expect(scrollHacks.setScrollKiller).toHaveBeenCalledWith(false)
    expect(devices.setScaleLock).toHaveBeenCalledWith(false)
  })

  it('does not call any mobile functions when on desktop', () => {
    onWidgetOpen(true, false, dispatch)

    expect(scrollHacks.revertWindowScroll).not.toHaveBeenCalled()
    expect(scrollHacks.setScrollKiller).not.toHaveBeenCalled()
    expect(devices.setScaleLock).not.toHaveBeenCalled()
  })

  it('broadcasts webWidget.onClose through mediator', () => {
    onWidgetOpen(true, false, dispatch)

    expect(mediator.channel.broadcast).toHaveBeenCalledWith('webWidget.onClose')
  })
})
