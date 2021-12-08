import { render } from 'classicSrc/util/testHelpers'
import { find } from 'styled-components/test-utils'
import ReconnectionBubble from '../'
import { Message } from '../styles'

describe('ReconnectionBubble', () => {
  const renderComponent = () => render(<ReconnectionBubble />)

  it('displays a message to let the user know Chat is reconnecting', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Reconnecting...')).toBeInTheDocument()
  })

  it('uses aria labels to notify screen readers that Chat is reconnecting', () => {
    const { container } = renderComponent()

    const message = find(container, Message)

    expect(message).toHaveAttribute('role', 'status')
    expect(message).toHaveAttribute('aria-live', 'polite')
  })

  it('displays a loading spinner', () => {
    const { queryByRole } = renderComponent()

    expect(queryByRole('progressbar')).toBeInTheDocument()
  })
})
