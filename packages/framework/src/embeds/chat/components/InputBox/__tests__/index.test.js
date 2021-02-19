import InputBox from '../'
import { fireEvent } from '@testing-library/react'
import { TEST_IDS } from 'src/constants/shared'
import { render } from 'utility/testHelpers'
import { keyCodes } from 'utility/keyboard'

const renderComponent = (inProps) => {
  const props = {
    currentMessage: '',
    sendChat: jest.fn(),
    handleChatBoxChange: jest.fn(),
    isMobile: false,
    ...inProps,
  }
  return render(<InputBox {...props} />)
}

describe('InputBox', () => {
  it('renders label', () => {
    expect(renderComponent().getByText('Type a message here...')).toBeInTheDocument()
  })
  it('renders currentMessage', () => {
    const { getByText } = renderComponent({ currentMessage: 'this is the message' })
    expect(getByText('this is the message')).toBeInTheDocument()
  })

  it('when enter is pressed, calls sendChat', async () => {
    const sendChat = jest.fn()
    const { queryByTestId } = renderComponent({ sendChat })

    expect(sendChat).not.toHaveBeenCalled()
    fireEvent.keyDown(queryByTestId(TEST_IDS.MESSAGE_FIELD), {
      key: 'Enter',
      keyCode: keyCodes.ENTER,
    })

    expect(sendChat).toHaveBeenCalled()
  })

  it('when value changes calls handleChatBoxChange', async () => {
    const handleChatBoxChange = jest.fn()
    const { queryByTestId } = renderComponent({ handleChatBoxChange })

    expect(handleChatBoxChange).not.toHaveBeenCalled()
    fireEvent.change(queryByTestId(TEST_IDS.MESSAGE_FIELD), { target: { value: 'new value' } })

    expect(handleChatBoxChange).toHaveBeenCalledWith('new value')
  })
})
