import { fireEvent } from '@testing-library/react'
import render from 'src/utils/test/render'
import FileInput from '../'

describe('FileInput', () => {
  const defaultProps = {
    ariaLabel: 'Upload file',
    accept: '.pdf,.png',
    onChange: jest.fn(),
  }
  const renderComponent = (props = {}) => render(<FileInput {...defaultProps} {...props} />)

  it('renders the back button with an aria-label', () => {
    const { getByLabelText } = renderComponent()
    expect(getByLabelText('Upload file')).toBeInTheDocument()
  })

  it('fires onChange event when files are selected', () => {
    const onChange = jest.fn()

    renderComponent({ onChange })

    fireEvent.change(document.querySelector('input'), { target: { files: ['emusing.pdf'] } })

    expect(onChange).toHaveBeenCalledWith(['emusing.pdf'])
  })

  it('triggers the input when the button is clicked', () => {
    const onClick = jest.fn()

    const { getByLabelText } = renderComponent()

    document.querySelector('input').click = onClick

    getByLabelText('Upload file').click()

    expect(onClick).toHaveBeenCalled()
  })

  it('can accept specific file types', () => {
    renderComponent()

    expect(document.querySelector('input')).toHaveAttribute('accept', '.pdf,.png')
  })
})
