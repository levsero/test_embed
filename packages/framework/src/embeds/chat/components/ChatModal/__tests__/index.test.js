import { render } from '@testing-library/react'
import { find } from 'styled-components/test-utils'
import ChatModal from 'src/embeds/chat/components/ChatModal'
import { Header, Backdrop } from 'src/embeds/chat/components/ChatModal/styles'

describe('ChatModal', () => {
  const defaultProps = {
    title: 'Modal title',
    children: <div>Modal content</div>,
    onClose: jest.fn(0),
  }

  const renderComponent = (props = {}) => render(<ChatModal {...defaultProps} {...props} />)

  it('renders the title when provided', () => {
    const { container } = renderComponent({ title: 'Some title' })

    expect(find(container, Header).textContent).toBe('Some title')
  })

  it('does not render the header when title is not provided', () => {
    const { container } = renderComponent({ title: null })

    expect(find(container, Header)).toBe(null)
  })

  it('renders the provided children', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Modal content')).toBeInTheDocument()
  })

  it('calls onClose when closed', () => {
    const onClose = jest.fn()

    const { container } = renderComponent({ onClose })

    find(container, Backdrop).click()

    expect(onClose).toHaveBeenCalled()
  })
})
