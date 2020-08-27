import { getIsLauncherVisible } from '../store'
import createStore from 'src/apps/messenger/store'
import { screenDimensionsChanged } from 'src/apps/messenger/features/responsiveDesign/store'
import { widgetClosed, widgetOpened } from 'src/apps/messenger/store/visibility'

describe('launcher store', () => {
  describe('getIsLauncherVisible', () => {
    it('is not visible if the screen is vertically small and the messenger is open', () => {
      const store = createStore()
      store.dispatch(screenDimensionsChanged({ isVerticallySmallScreen: true }))
      store.dispatch(widgetOpened())

      expect(getIsLauncherVisible(store.getState())).toBe(false)
    })

    it('is not visible if the messenger is in full screen mode and the messenger is open', () => {
      const store = createStore()
      store.dispatch(widgetOpened())

      store.dispatch(
        screenDimensionsChanged({ isVerticallySmallScreen: true, isHorizontallySmallScreen: true })
      )

      expect(getIsLauncherVisible(store.getState())).toBe(false)
    })

    it('is visible if the widget is closed on a small screen', () => {
      const store = createStore()
      store.dispatch(widgetClosed())

      store.dispatch(
        screenDimensionsChanged({ isVerticallySmallScreen: true, isHorizontallySmallScreen: true })
      )

      expect(getIsLauncherVisible(store.getState())).toBe(true)
    })

    it('is visible for all other cases', () => {
      const store = createStore()

      store.dispatch(
        screenDimensionsChanged({
          isVerticallySmallScreen: false,
          isHorizontallySmallScreen: false
        })
      )

      expect(getIsLauncherVisible(store.getState())).toBe(true)
    })
  })
})
