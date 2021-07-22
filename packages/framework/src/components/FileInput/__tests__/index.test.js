import { fireEvent } from '@testing-library/dom'
import { render } from 'src/util/testHelpers'
import FileInput from '../'

describe('FileInput', () => {
  const defaultProps = {}

  const renderComponent = (props = {}) =>
    render(
      <FileInput {...defaultProps} {...props}>
        <button>Click me</button>
      </FileInput>
    )

  it('calls onFileSelect when the files have been selected to be uploaded', () => {
    const onFileSelect = jest.fn()

    const { container } = renderComponent({ onFileSelect })

    fireEvent.change(container.querySelector('input'), { target: { files: [{ name: 'new' }] } })

    expect(onFileSelect).toHaveBeenCalledWith([{ name: 'new' }])
  })

  it('allows you to render your own view for the file input', () => {
    const { container, queryByText } = renderComponent()

    const clickSpy = jest.spyOn(container.querySelector('input'), 'click')

    fireEvent.click(queryByText('Click me'))

    expect(clickSpy).toHaveBeenCalled()
  })
})
