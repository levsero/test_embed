import { fireEvent } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import ReconnectButton from 'embeds/chat/components/ReconnectButton'

describe('ReconnectButton', () => {
  const defaultProps = {
    onClick: jest.fn(),
  }

  const renderComponent = (props = {}) => render(<ReconnectButton {...defaultProps} {...props} />)

  it('displays a label prompting the user to click to reconnect', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Click to reconnect')).toBeInTheDocument()
  })

  it('calls onClick when button is clicked', () => {
    const onClick = jest.fn()
    const { queryByText } = renderComponent({ onClick })

    fireEvent.click(queryByText('Click to reconnect'))

    expect(onClick).toHaveBeenCalled()
  })
})
