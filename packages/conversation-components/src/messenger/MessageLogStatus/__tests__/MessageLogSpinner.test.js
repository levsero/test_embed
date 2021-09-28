import MessageLogSpinner from 'src/messenger/MessageLogStatus/MessageLogSpinner'
import render from 'src/utils/test/render'

describe('MessageLogSpinner', () => {
  const defaultProps = {}

  const renderComponent = (props = {}) => render(<MessageLogSpinner {...defaultProps} {...props} />)

  it('displays an accessible spinner', () => {
    const { getByLabelText } = renderComponent()

    expect(getByLabelText('Loading conversation')).toBeInTheDocument()
  })

  it('displays an visual spinner', () => {
    const { getByRole } = renderComponent()

    expect(getByRole('progressbar')).toBeInTheDocument()
  })
})
