import HeaderView from 'classicSrc/components/Widget/Header/HeaderView'
import Title from 'classicSrc/components/Widget/Header/Title'
import * as selectors from 'classicSrc/redux/modules/selectors/selectors'
import { render } from 'classicSrc/util/testHelpers'
import { find } from 'styled-components/test-utils'
import Header from '../'

describe('Header', () => {
  const defaultProps = {
    title: undefined,
    children: <div>Some child component</div>,
  }

  const renderComponent = (props = {}) => render(<Header {...defaultProps} {...props} />)

  beforeEach(() => {
    jest.spyOn(selectors, 'getShowBackButton').mockReturnValue(true)
  })

  describe('with default props', () => {
    let result

    beforeEach(() => {
      result = renderComponent()
    })

    it('renders a back button', () => {
      const { queryByLabelText } = result

      expect(queryByLabelText('Back')).toBeInTheDocument()
    })

    it('renders an empty title component so that button positioning works', () => {
      const { container } = result

      expect(find(container, Title)).toHaveTextContent('')
    })

    it('renders a close button', () => {
      const { queryByLabelText } = result

      expect(queryByLabelText('Minimize widget')).toBeInTheDocument()
    })
  })

  describe('with custom props', () => {
    it('can hide the back button', () => {
      const result = renderComponent({ showBackButton: false })
      const { queryByLabelText } = result

      expect(queryByLabelText('Back')).not.toBeInTheDocument()
    })

    it('renders a title when provided', () => {
      const { container } = renderComponent({ title: 'Widget title' })

      expect(find(container, Title)).toHaveTextContent('Widget title')
    })

    it('can hide the close button', () => {
      const { queryByLabelText } = renderComponent({ showCloseButton: false })

      expect(queryByLabelText('Minimize widget')).not.toBeInTheDocument()
    })

    it('renders children after the title row', () => {
      const { container } = renderComponent({ children: <div>children</div> })

      const lastChild = find(container, HeaderView).lastChild

      expect(lastChild).toHaveTextContent('children')
    })
  })
})
