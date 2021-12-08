import { fireEvent } from '@testing-library/react'
import ReconnectButton from 'classicSrc/embeds/chat/components/ReconnectButton'
import { render } from 'classicSrc/util/testHelpers'

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
