import { render } from 'src/apps/messenger/utils/testHelpers'

import UnreadIndicator from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    unreadCount: 20,
  }

  return render(<UnreadIndicator {...defaultProps} {...props} />)
}

describe('UnreadIndicator', () => {
  it('displays an unread indicator when there are unread messages', () => {
    const { getByText } = renderComponent({ unreadCount: 37 })

    expect(getByText('37')).toBeInTheDocument()
  })

  it('displays + in the unread indicator when there are more than 99 messages', () => {
    const { getByText } = renderComponent({ unreadCount: 100 })

    expect(getByText('99')).toBeInTheDocument()
    expect(getByText('+')).toBeInTheDocument()
  })
})
