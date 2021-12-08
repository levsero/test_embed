import { fireEvent, wait } from '@testing-library/react'
import { render } from 'classicSrc/util/testHelpers'
import { FileDropProvider, FileDropTarget, useOnDrop } from '../'

describe('FileDropProvider', () => {
  const defaultProps = {
    onDrop: jest.fn(),
  }

  const ExampleComponent = ({ onDrop }) => {
    useOnDrop(onDrop)

    return null
  }

  const renderComponent = (props = {}) =>
    render(
      <FileDropProvider>
        <p>Some text</p>
        <ExampleComponent {...defaultProps} {...props} />
      </FileDropProvider>
    )

  it('displays the drop target while a file is being dragged', async () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Drop to attach')).not.toBeInTheDocument()

    const elementInsideDropProvider = queryByText('Some text')

    fireEvent.dragEnter(elementInsideDropProvider)

    await wait(() => expect(queryByText('Drop to attach')).toBeInTheDocument())
  })

  it('stops showing the drop target when file is dragged out of it', async () => {
    const { queryByText } = renderComponent()

    fireEvent.dragEnter(queryByText('Some text'))
    await wait(() => expect(queryByText('Drop to attach')).toBeInTheDocument())

    fireEvent.dragLeave(queryByText('Drop to attach'))
    await wait(() => expect(queryByText('Drop to attach')).not.toBeInTheDocument())
  })

  it('hides the drop target when files are dropped into it', async () => {
    const files = [{ id: 'file1' }, { id: 'file2' }]
    const { queryByText } = renderComponent()

    fireEvent.dragEnter(queryByText('Some text'))
    await wait(() => expect(queryByText('Drop to attach')).toBeInTheDocument())

    fireEvent.drop(queryByText('Drop to attach'), {
      target: {
        files,
      },
    })

    await wait(() => expect(queryByText('Drop to attach')).not.toBeInTheDocument())
  })

  describe('useOnDrop', () => {
    it('calls the callback function when a file has been dropped into the drop target', async () => {
      const onDrop = jest.fn()
      const files = [{ id: 'file1' }, { id: 'file2' }]
      const { queryByText } = renderComponent({ onDrop })

      fireEvent.dragEnter(queryByText('Some text'))
      await wait(() => expect(queryByText('Drop to attach')).toBeInTheDocument())

      fireEvent.drop(queryByText('Drop to attach'), {
        target: {
          files,
        },
      })

      expect(onDrop).toHaveBeenCalledWith(files)
    })
  })

  describe('FileDropTarget', () => {
    const renderComponent = (props) =>
      render(
        <FileDropProvider>
          <p>Some text</p>
          <FileDropTarget {...props} />
        </FileDropProvider>
      )

    it('calls the callback function when a file has been dropped into the drop target', async () => {
      const onDrop = jest.fn()
      const files = [{ id: 'file1' }, { id: 'file2' }]
      const { queryByText } = renderComponent({ onDrop })

      fireEvent.dragEnter(queryByText('Some text'))
      await wait(() => expect(queryByText('Drop to attach')).toBeInTheDocument())

      fireEvent.drop(queryByText('Drop to attach'), {
        target: {
          files,
        },
      })

      expect(onDrop).toHaveBeenCalledWith(files)
    })
  })
})
