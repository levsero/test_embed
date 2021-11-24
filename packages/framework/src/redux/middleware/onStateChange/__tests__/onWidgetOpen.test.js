let baseSelectors = require('src/redux/modules/base/base-selectors')
let selectors = require('src/redux/modules/selectors')
let baseActions = require('src/redux/modules/base/base-actions')
let scrollHacks = require('src/util/scrollHacks')
let onWidgetOpen = require('../onWidgetOpen').default
let { isMobileBrowser, setScaleLock } = require('@zendesk/widget-shared-services')
let chatSelectors = require('src/embeds/chat/selectors/selectors')

jest.mock('@zendesk/widget-shared-services', () => {
  const originalModule = jest.requireActual('@zendesk/widget-shared-services')

  return {
    __esModule: true,
    ...originalModule,
    isMobileBrowser: jest.fn(),
    setScaleLock: jest.fn(),
  }
})

const dispatch = jest.fn()

beforeEach(() => {
  jest.resetModules()
  jest.useFakeTimers()

  onWidgetOpen = require('../onWidgetOpen').default
  setScaleLock = require('@zendesk/widget-shared-services').setScaleLock
  isMobileBrowser = require('@zendesk/widget-shared-services').isMobileBrowser
  baseSelectors = require('src/redux/modules/base/base-selectors')
  selectors = require('src/redux/modules/selectors')
  baseActions = require('src/redux/modules/base/base-actions')
  scrollHacks = require('src/util/scrollHacks')
  chatSelectors = require('src/embeds/chat/selectors/selectors')

  jest.mock('src/service/renderer')

  jest.mock('src/redux/modules/base/base-actions')
  jest.mock('src/redux/modules/selectors')
  jest.mock('src/util/scrollHacks')
  jest.mock('src/embeds/chat/selectors/selectors')

  jest.spyOn(selectors, 'getWebWidgetVisibleOpenAndReady').mockImplementation((state) => state)
  jest.spyOn(baseSelectors, 'getActiveEmbed').mockImplementation(() => 'helpCenter')
})

describe('when widget visibility transitions from false to true', () => {
  it('dispatches updateWidgetShown with true', () => {
    onWidgetOpen(false, true, dispatch)

    expect(baseActions.updateWidgetShown).toHaveBeenCalledWith(true)
  })

  it('calls mobile functions when on mobile', () => {
    isMobileBrowser.mockReturnValue(true)
    chatSelectors.getStandaloneMobileNotificationVisible.mockReturnValue(false)

    onWidgetOpen(false, true, dispatch, () => true)

    jest.runAllTimers()

    expect(scrollHacks.setWindowScroll).toHaveBeenCalledWith(0)
    expect(scrollHacks.setScrollKiller).toHaveBeenCalledWith(true)
    expect(setScaleLock).toHaveBeenCalledWith(true)
  })

  it('disables auto-scroll-to-the-top when proactivechat popup is displayed', () => {
    isMobileBrowser.mockReturnValue(true)
    chatSelectors.getStandaloneMobileNotificationVisible.mockReturnValue(true)

    onWidgetOpen(false, true, dispatch, () => true)

    jest.runAllTimers()

    expect(scrollHacks.setWindowScroll).toHaveBeenCalledTimes(0)
    expect(scrollHacks.setScrollKiller).toHaveBeenCalledTimes(0)
    expect(setScaleLock).toHaveBeenCalledWith(true)
  })

  it('does not call any mobile functions when on desktop', () => {
    onWidgetOpen(false, true, dispatch)

    jest.runAllTimers()

    expect(scrollHacks.setWindowScroll).not.toHaveBeenCalled()
    expect(scrollHacks.setScrollKiller).not.toHaveBeenCalled()
    expect(setScaleLock).not.toHaveBeenCalled()
  })
})

describe('when widget visibility transitions from true to false', () => {
  it('dispatches updateWidgetShown with true', () => {
    onWidgetOpen(true, false, dispatch)

    expect(baseActions.updateWidgetShown).toHaveBeenCalledWith(false)
  })

  it('calls mobile functions when on mobile', () => {
    isMobileBrowser.mockReturnValue(true)

    onWidgetOpen(true, false, dispatch)

    expect(scrollHacks.revertWindowScroll).toHaveBeenCalled()
    expect(scrollHacks.setScrollKiller).toHaveBeenCalledWith(false)
    expect(setScaleLock).toHaveBeenCalledWith(false)
  })

  it('does not call any mobile functions when on desktop', () => {
    onWidgetOpen(true, false, dispatch)

    expect(scrollHacks.revertWindowScroll).not.toHaveBeenCalled()
    expect(scrollHacks.setScrollKiller).not.toHaveBeenCalled()
    expect(setScaleLock).not.toHaveBeenCalled()
  })
})
