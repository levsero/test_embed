import { frameMarginFromPage } from 'src/apps/messenger/constants'
import { screenDimensionsChanged } from 'src/apps/messenger/features/responsiveDesign/store'
import { widgetOpened } from 'src/apps/messenger/store/visibility'
import { render } from 'src/apps/messenger/utils/testHelpers'
import Launcher from '../'

describe('Launcher', () => {
  const renderComponent = () => render(<Launcher />)

  describe('when launcher is visible', () => {
    it('renders an iframe', () => {
      const { getByTitle, store } = renderComponent()
      store.dispatch(screenDimensionsChanged({ isVerticallySmallScreen: false }))

      expect(getByTitle('Button to launch messaging window')).toBeInTheDocument()
    })

    it('is positioned in the bottom right of the screen', () => {
      const { getByTitle, store } = renderComponent()
      store.dispatch(screenDimensionsChanged({ isVerticallySmallScreen: false }))

      expect(getByTitle('Button to launch messaging window')).toHaveStyle(`
      bottom: ${frameMarginFromPage}px;
      right: ${frameMarginFromPage}px;
    `)
    })
  })

  describe('when launcher is not visible', () => {
    it('is not shown', () => {
      const { queryByTitle, store } = renderComponent()

      store.dispatch(screenDimensionsChanged({ isVerticallySmallScreen: true }))
      store.dispatch(widgetOpened())

      expect(queryByTitle('Button to launch messaging window').style.display).toBe('none')
    })
  })
})
