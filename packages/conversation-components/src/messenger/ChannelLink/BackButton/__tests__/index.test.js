import render from 'src/utils/test/render'
import BackButton from '../'

const mockOnClick = jest.fn()

describe('BackButton', () => {
  const renderComponent = (props) => render(<BackButton {...props} />)

  it('renders the back button with an aria-label', () => {
    const { getByLabelText } = renderComponent({ ariaLabel: 'Back to conversation' })

    expect(getByLabelText('Back to conversation')).toBeInTheDocument()
  })

  it('fires the onClick event when back button is clicked', () => {
    const { getByLabelText } = renderComponent({
      ariaLabel: 'Back to conversation',
      onClick: mockOnClick,
    })

    getByLabelText('Back to conversation').click()
    expect(mockOnClick).toHaveBeenCalled()
  })
})
