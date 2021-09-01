import render from 'src/utils/test/render'
import TextButton from '../'

describe('TextButton', () => {
  const defaultProps = {
    children: 'Text',
  }

  const renderComponent = (props = {}) => {
    return render(<TextButton {...defaultProps} {...props} />)
  }

  it('displays a button with whatever you pass in as children', () => {
    const { getByText } = renderComponent({ children: 'Whatever you want' })

    expect(getByText('Whatever you want')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()

    const { getByText } = renderComponent({ onClick })

    getByText('Text').click()

    expect(onClick).toHaveBeenCalled()
  })

  describe('when href is provided', () => {
    it('renders as an anchor tag', () => {
      const { getByText } = renderComponent({ href: 'www.google.com' })

      expect(getByText('Text')).toBeInstanceOf(HTMLAnchorElement)
    })

    it('includes safe defaults for target and rel attributes', () => {
      const { getByText } = renderComponent({ href: 'www.google.com' })

      expect(getByText('Text')).toHaveAttribute('target', '_blank')
      expect(getByText('Text')).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('when href is not provided', () => {
    it('renders as a button', () => {
      const { getByText } = renderComponent()

      expect(getByText('Text')).toBeInstanceOf(HTMLButtonElement)
    })
  })
})
