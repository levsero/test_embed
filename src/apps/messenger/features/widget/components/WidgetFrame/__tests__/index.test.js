import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import * as launcherStore from 'src/apps/messenger/features/launcher/store'
import WidgetFrame from '../index'
import { screenDimensionsChanged } from 'src/apps/messenger/features/responsiveDesign/store'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'
import {
  frameBoxShadow,
  frameMarginFromPage,
  launcherSize,
  marginBetweenFrames
} from 'src/apps/messenger/constants'

describe('WidgetFrame', () => {
  const renderComponent = () => render(<WidgetFrame />)

  it('renders an iframe', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('Messenger')).toBeInTheDocument()
  })

  describe('styles', () => {
    it('has a box shadow when not in fullscreen mode', () => {
      const { store, getByTitle } = renderComponent()
      store.dispatch(
        screenDimensionsChanged({
          isFullScreen: true
        })
      )

      expect(getByTitle('Messenger')).toHaveStyle('box-shadow: none;')

      store.dispatch(
        screenDimensionsChanged({
          isFullScreen: false
        })
      )

      expect(getByTitle('Messenger')).toHaveStyle(`box-shadow: ${frameBoxShadow}`)
    })

    it('is positioned on the right when config specifies it to be on the right', () => {
      const { getByTitle, store } = renderComponent()
      store.dispatch(messengerConfigReceived({ position: 'right' }))

      expect(getByTitle('Messenger')).toHaveStyle(`right: ${frameMarginFromPage}px`)
    })

    it('is positioned on the left when config specifies it to be on the left', () => {
      const { getByTitle, store } = renderComponent()
      store.dispatch(messengerConfigReceived({ position: 'left' }))

      expect(getByTitle('Messenger')).toHaveStyle(`left: ${frameMarginFromPage}px`)
    })

    it('is positioned high above the launcher when the launcher is visible', () => {
      jest.spyOn(launcherStore, 'getIsLauncherVisible').mockReturnValue(true)
      const { getByTitle } = renderComponent()

      expect(getByTitle('Messenger')).toHaveStyle(
        `bottom: ${launcherSize + frameMarginFromPage + marginBetweenFrames}px`
      )
    })

    it('is positioned at the bottom of the screen when the launcher is not visible', () => {
      jest.spyOn(launcherStore, 'getIsLauncherVisible').mockReturnValue(false)
      const { getByTitle } = renderComponent()

      expect(getByTitle('Messenger')).toHaveStyle(`bottom: ${frameMarginFromPage}px`)
    })

    it('takes up part of the screen when on a large screen', () => {
      const { getByTitle, store } = renderComponent()
      store.dispatch(
        screenDimensionsChanged({
          isVerticallySmallScreen: false,
          isFullScreen: false
        })
      )

      expect(getByTitle('Messenger')).toHaveStyle(`
        height: 500px
        width: 300px
        maxHeight: calc(100vh - 90px - 10px);
      `)
    })

    it('takes up the whole screen when on a small screen', () => {
      const { getByTitle, store } = renderComponent()
      store.dispatch(
        screenDimensionsChanged({
          isFullScreen: true
        })
      )

      expect(getByTitle('Messenger')).toHaveStyle(`
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
          isFullScreen: false
        })
      )

      expect(getByTitle('Messenger')).toHaveStyle(`
        max-height: calc(100vh - ${frameMarginFromPage * 2}px);
      `)
    })
  })
})
