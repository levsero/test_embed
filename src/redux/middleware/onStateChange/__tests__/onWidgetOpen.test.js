let baseSelectors = require('src/redux/modules/base/base-selectors')
let selectors = require('src/redux/modules/selectors')
let baseActions = require('src/redux/modules/base/base-actions')
let scrollHacks = require('utility/scrollHacks')
let onWidgetOpen = require('../onWidgetOpen').default
let isMobileBrowser = require('utility/devices').isMobileBrowser

const dispatch = jest.fn()

beforeEach(() => {
  jest.resetModules()
  jest.useFakeTimers()

  onWidgetOpen = require('../onWidgetOpen').default
  isMobileBrowser = require('utility/devices').isMobileBrowser
  baseSelectors = require('src/redux/modules/base/base-selectors')
  selectors = require('src/redux/modules/selectors')
  baseActions = require('src/redux/modules/base/base-actions')
  scrollHacks = require('utility/scrollHacks')

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

  it('calls setWindowScroll and setScrollKiller when on mobile', () => {
    isMobileBrowser.mockReturnValue(true)

    onWidgetOpen(false, true, dispatch)

    jest.runAllTimers()

    expect(scrollHacks.setWindowScroll).toHaveBeenCalledWith(0)
    expect(scrollHacks.setScrollKiller).toHaveBeenCalledWith(true)
  })

  it('does not call setWindowScroll and setScrollKiller when on desktop', () => {
    onWidgetOpen(false, true, dispatch)

    jest.runAllTimers()

    expect(scrollHacks.setWindowScroll).not.toHaveBeenCalled()
    expect(scrollHacks.setScrollKiller).not.toHaveBeenCalled()
  })
})

describe('when widget visibility transitions from true to false', () => {
  it('dispatches updateWidgetShown with true', () => {
    onWidgetOpen(true, false, dispatch)

    expect(baseActions.updateWidgetShown).toHaveBeenCalledWith(false)
  })

  it('calls setWindowScroll and setScrollKiller when on mobile', () => {
    isMobileBrowser.mockReturnValue(true)

    onWidgetOpen(true, false, dispatch)

    expect(scrollHacks.revertWindowScroll).toHaveBeenCalled()
    expect(scrollHacks.setScrollKiller).toHaveBeenCalledWith(false)
  })

  it('does not call setWindowScroll and setScrollKiller when on desktop', () => {
    onWidgetOpen(true, false, dispatch)

    expect(scrollHacks.revertWindowScroll).not.toHaveBeenCalled()
    expect(scrollHacks.setScrollKiller).not.toHaveBeenCalled()
  })
})
