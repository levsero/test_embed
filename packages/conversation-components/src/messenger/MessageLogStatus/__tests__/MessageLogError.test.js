import MessageLogError from 'src/messenger/MessageLogStatus/MessageLogError'
import render from 'src/utils/test/render'

describe('MessageLogError', () => {
  const defaultProps = {
    onRetry: jest.fn(),
  }

  const renderComponent = (props = {}) => render(<MessageLogError {...defaultProps} {...props} />)

  it('displays the reason why it errored', () => {
    const { getByText } = renderComponent()

    expect(getByText('Couldn’t load messages')).toBeInTheDocument()
  })

  it('gives the ability to retry', () => {
    const onRetry = jest.fn()
    const { getByText } = renderComponent({ onRetry })

    getByText('Tap to retry').click()

    expect(onRetry).toHaveBeenCalled()
  })
})
