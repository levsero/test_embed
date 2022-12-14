import { waitFor, fireEvent } from '@testing-library/dom'
import { render } from 'classicSrc/util/testHelpers'
import EndChat from '../'

const endChatViaPostChatScreen = jest.fn(),
  onClose = jest.fn()

const renderComponent = async (props = {}) => {
  const defaultProps = {
    endChatViaPostChatScreen,
    onClose,
  }

  const result = render(<EndChat {...defaultProps} {...props} />)

  await waitFor(() =>
    expect(result.queryByText('Are you sure you want to end this chat?')).toBeInTheDocument()
  )

  return result
}

describe('EndChat', () => {
  it('displays End button', async () => {
    const { queryByText } = await renderComponent()

    expect(queryByText('End')).toBeInTheDocument()
  })

  it('displays Cancel button', async () => {
    const { queryByText } = await renderComponent()

    expect(queryByText('Cancel')).toBeInTheDocument()
  })

  it('calls EndChatViaPostChatScreen when End is clicked', async () => {
    const { queryByText } = await renderComponent()

    fireEvent.click(queryByText('End'))

    expect(endChatViaPostChatScreen).toHaveBeenCalled()
  })

  it('Closes itself when End is clicked', async () => {
    const { queryByText } = await renderComponent()

    fireEvent.click(queryByText('End'))

    expect(onClose).toHaveBeenCalled()
  })

  it('Closes itself when Cancel is clicked', async () => {
    const { queryByText } = await renderComponent()

    fireEvent.click(queryByText('Cancel'))

    expect(onClose).toHaveBeenCalled()
  })
})
