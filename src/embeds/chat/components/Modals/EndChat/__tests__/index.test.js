import React from 'react'
import { render } from 'src/util/testHelpers'
import EndChat from '../'
import { wait, fireEvent } from '@testing-library/dom'

const endChatViaPostChatScreen = jest.fn(),
  onClose = jest.fn()

const renderComponent = async (props = {}) => {
  const defaultProps = {
    endChatViaPostChatScreen,
    onClose
  }

  const result = render(<EndChat {...defaultProps} {...props} />)

  await wait(() =>
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
