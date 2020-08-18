import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import Launcher from '../'
import { screenDimensionsChanged } from 'src/apps/messenger/features/responsiveDesign/store'
import { widgetOpened } from 'src/apps/messenger/store/visibility'

describe('Launcher', () => {
  const renderComponent = () => render(<Launcher />)

  describe('when launcher is visible', () => {
    it('renders an iframe', () => {
      const { getByTitle, store } = renderComponent()
      store.dispatch(screenDimensionsChanged({ isVerticallySmallScreen: false }))

      expect(getByTitle('TODO: Launcher')).toBeInTheDocument()
    })

    it('is positioned in the bottom right of the screen', () => {
      const { getByTitle, store } = renderComponent()
      store.dispatch(screenDimensionsChanged({ isVerticallySmallScreen: false }))

      expect(getByTitle('TODO: Launcher')).toHaveStyle(`
      bottom: 0px;
      rightL: 0px;
    `)
    })
  })

  describe('when launcher is not visible', () => {
    it('does not render anything', () => {
      const { queryByTitle, store } = renderComponent()

      store.dispatch(screenDimensionsChanged({ isVerticallySmallScreen: true }))
      store.dispatch(widgetOpened())

      expect(queryByTitle('TODO: Launcher')).toBeNull()
    })
  })
})
