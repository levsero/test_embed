import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import * as launcherStore from 'src/apps/messenger/features/launcher/store'
import WidgetFrame from '../index'
import { screenDimensionsChanged } from 'src/apps/messenger/features/responsiveDesign/store'

describe('WidgetFrame', () => {
  const renderComponent = () => render(<WidgetFrame />)

  it('renders an iframe', () => {
    const { getByTitle } = renderComponent()

    expect(getByTitle('Messenger')).toBeInTheDocument()
  })

  describe('styles', () => {
    it('is positioned high above the bottom of the screen when the launcher is visible', () => {
      jest.spyOn(launcherStore, 'getIsLauncherVisible').mockReturnValue(true)
      const { getByTitle } = renderComponent()

      expect(getByTitle('Messenger')).toHaveStyle('bottom: 90px')
    })

    it('is positioned at the bottom of the screen when the launcher is not visible', () => {
      jest.spyOn(launcherStore, 'getIsLauncherVisible').mockReturnValue(false)
      const { getByTitle } = renderComponent()

      expect(getByTitle('Messenger')).toHaveStyle('bottom: 0px')
    })

    it('takes up part of the screen when on a large screen', () => {
      const { getByTitle, store } = renderComponent()
      store.dispatch(
        screenDimensionsChanged({
          isVerticallySmallScreen: false,
          isHorizontallySmallScreen: false
        })
      )

      expect(getByTitle('Messenger')).toHaveStyle(`
        height: 500px
        width: 300px
        maxHeight: calc(100vh - 90px - 10px);
      `)
    })

    it('takes up the whole screen when the screen is vertically and horizontally small', () => {
      const { getByTitle, store } = renderComponent()
      store.dispatch(
        screenDimensionsChanged({
          isVerticallySmallScreen: true,
          isHorizontallySmallScreen: true
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
          isHorizontallySmallScreen: true
        })
      )

      expect(getByTitle('Messenger')).toHaveStyle(`
        height: 100%;
        max-height: none;
      `)
    })
  })
})
