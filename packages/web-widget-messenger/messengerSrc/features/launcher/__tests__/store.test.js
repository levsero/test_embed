import { screenDimensionsChanged } from 'messengerSrc/features/responsiveDesign/store'
import createStore from 'messengerSrc/store'
import { messengerConfigReceived } from 'messengerSrc/store/actions'
import { widgetClosed, widgetOpened } from 'messengerSrc/store/visibility'
import { getIsLauncherVisible, getLauncherShape } from '../store'

describe('launcher store', () => {
  describe('getIsLauncherVisible', () => {
    it('is not visible if launcher shape is none', () => {
      const store = createStore()
      store.dispatch(
        messengerConfigReceived({
          launcher: {
            shape: 'none',
          },
        })
      )
      expect(getIsLauncherVisible(store.getState())).toBe(false)
    })

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
          isHorizontallySmallScreen: false,
        })
      )

      expect(getIsLauncherVisible(store.getState())).toBe(true)
    })
  })

  describe('getLauncherShape', () => {
    it('sets the launcher shape to match whats in the embeddable config ', () => {
      const store = createStore()
      const shape = 'circle'

      store.dispatch(
        messengerConfigReceived({
          launcher: {
            shape,
          },
        })
      )

      expect(getLauncherShape(store.getState())).toBe(shape)
    })
  })
})
