import { frameMarginFromPage, launcherSize, marginBetweenFrames } from 'messengerSrc/constants'
import * as launcherStore from 'messengerSrc/features/launcher/store'
import { screenDimensionsChanged } from 'messengerSrc/features/responsiveDesign/store'
import { messengerConfigReceived } from 'messengerSrc/store/actions'
import { render } from 'messengerSrc/utils/testHelpers'
import WidgetFrame from '../index'

describe('WidgetFrame', () => {
  const renderComponent = () => render(<WidgetFrame />)

  it('renders an iframe', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('Messaging window')).toBeInTheDocument()
  })

  describe('styles', () => {
    it('is positioned on the right when config specifies it to be on the right', () => {
      const { getByTitle, store } = renderComponent()
      store.dispatch(messengerConfigReceived({ position: 'right' }))

      expect(getByTitle('Messaging window').parentNode).toHaveStyle(
        `right: ${frameMarginFromPage}px`
      )
    })

    it('is positioned on the left when config specifies it to be on the left', () => {
      const { getByTitle, store } = renderComponent()
      store.dispatch(messengerConfigReceived({ position: 'left' }))

      expect(getByTitle('Messaging window').parentNode).toHaveStyle(
        `left: ${frameMarginFromPage}px`
      )
    })

    it('is positioned high above the launcher when the launcher is visible', () => {
      jest.spyOn(launcherStore, 'getIsLauncherVisible').mockReturnValue(true)
      const { getByTitle } = renderComponent()

      expect(getByTitle('Messaging window').parentNode).toHaveStyle(
        `bottom: ${launcherSize + frameMarginFromPage + marginBetweenFrames}px`
      )
    })

    it('is positioned at the bottom of the screen when the launcher is not visible', () => {
      jest.spyOn(launcherStore, 'getIsLauncherVisible').mockReturnValue(false)
      const { getByTitle } = renderComponent()

      expect(getByTitle('Messaging window').parentNode).toHaveStyle(
        `bottom: ${frameMarginFromPage}px`
      )
    })

    it('takes up part of the screen when on a large screen', () => {
      const { getByTitle, store } = renderComponent()
      store.dispatch(
        screenDimensionsChanged({
          isVerticallySmallScreen: false,
          isFullScreen: false,
        })
      )

      expect(getByTitle('Messaging window').parentNode).not.toHaveStyle(`
        height: 100%;
      `)
    })

    it('takes up the whole screen when on a small screen', () => {
      const { getByTitle, store } = renderComponent()
      store.dispatch(
        screenDimensionsChanged({
          isFullScreen: true,
        })
      )

      expect(getByTitle('Messaging window').parentNode).toHaveStyle(`
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
      `)
    })

    it('takes up the height of the screen when the screen is vertically small', () => {
      const { getByTitle, store } = renderComponent()

      store.dispatch(
        screenDimensionsChanged({
          isVerticallySmallScreen: true,
          isFullScreen: false,
        })
      )

      expect(getByTitle('Messaging window').parentNode).toHaveStyle(`
        max-height: calc(100vh - ${frameMarginFromPage * 2}px);
      `)
    })
  })
})
