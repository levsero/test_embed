import LoadingMessagesIndicator from '..'
import { render } from 'src/util/testHelpers'

describe('LoadingMessagesIndicator', () => {
  const defaultProps = {
    loading: false,
  }

  const renderComponent = (props = {}) =>
    render(<LoadingMessagesIndicator {...defaultProps} {...props} />)

  it('renders nothing when not loading', () => {
    const { queryByText } = renderComponent({ loading: false })

    expect(queryByText('Loading messages...')).not.toBeInTheDocument()
  })

  it('renders a loading message when loading', () => {
    const { queryByText } = renderComponent({ loading: true })

    expect(queryByText('Loading messages...')).toBeInTheDocument()
  })
})
