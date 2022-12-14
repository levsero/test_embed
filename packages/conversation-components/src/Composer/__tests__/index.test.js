import { createRef } from 'react'
import render from 'src/utils/test/render'
import Composer from '../'

const mockOnSendMessageFn = jest.fn()

describe('Composer', () => {
  const defaultProps = {
    inputAriaLabel: 'Type a message',
  }

  const renderComponent = (props = {}, ref) => {
    return render(<Composer {...defaultProps} {...props} ref={ref} />)
  }

  it('renders the component with a placeholder', () => {
    const { getByLabelText } = renderComponent()

    expect(getByLabelText('Type a message')).toHaveAttribute('placeholder', 'Type a message')
  })

  it('does not set focus on initial render by default', () => {
    const { getByLabelText } = renderComponent()

    expect(getByLabelText('Type a message')).not.toHaveFocus()
  })

  it('supports passing in a ref to control focus within a parent component', () => {
    const myTestRef = createRef()
    const { getByLabelText } = renderComponent({}, myTestRef)
    myTestRef.current.focus()

    expect(getByLabelText('Type a message')).toHaveFocus()
  })

  it('does not show the send icon before the user starts typing', () => {
    const { queryByLabelText } = renderComponent()

    expect(queryByLabelText('Send a message')).not.toBeInTheDocument()
  })

  it('shows the send icon once the user starts typing', () => {
    const { getByLabelText } = renderComponent({ initialValue: 'hello I am a user' })

    expect(getByLabelText('Send a message')).toBeInTheDocument()
  })

  it('fires the onSendMessage when the send button is clicked', () => {
    const { getByLabelText } = renderComponent({
      initialValue: 'Fig and ginger crispbread',
      onSendMessage: mockOnSendMessageFn,
    })

    getByLabelText('Send a message').click()
    expect(mockOnSendMessageFn).toHaveBeenCalledWith('Fig and ginger crispbread')
  })
})
