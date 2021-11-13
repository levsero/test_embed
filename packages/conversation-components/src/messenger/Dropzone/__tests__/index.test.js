import { screen, fireEvent, waitFor } from '@testing-library/dom'
import { find } from 'styled-components/test-utils'
import render from 'src/utils/test/render'
import Dropzone from '../index'
import { UploadIcon } from '../styles'

const renderComponent = (props = {}) => {
  return render(<Dropzone {...props} />)
}

const onDrop = jest.fn()

describe('Dropzone', () => {
  describe('when it is forced to display', () => {
    it('initially renders Dropzone', () => {
      const { container } = renderComponent({ onDrop, forceDisplay: true })

      expect(find(container, UploadIcon)).toBeInTheDocument()
      expect(screen.getByText('Send')).toBeInTheDocument()
    })

    it('triggers onDrop function after a file has been uploaded', async () => {
      const file = new File(['file'], 'test.png', { type: 'image/png' })
      renderComponent({ onDrop, forceDisplay: true })
      const uploader = screen.getByText('Send')

      fireEvent.drop(uploader, {
        target: {
          files: [file],
        },
      })

      expect(onDrop).toHaveBeenCalledTimes(1)
    })
  })

  describe('when it is not forced to display', () => {
    it('initially not render Dropzone', () => {
      renderComponent({ onDrop, forceDisplay: false })

      expect(screen.queryByText('Send')).not.toBeInTheDocument()
    })

    it('render Dropzone when a file is being dragged', () => {
      renderComponent({ onDrop, forceDisplay: false })

      fireEvent.dragEnter(screen.queryByTestId('dropzone-container'))

      expect(screen.getByText('Send')).toBeInTheDocument()
    })

    it('does not render Dropzone when a file is dragged out of it', async () => {
      renderComponent({ onDrop, forceDisplay: false })

      fireEvent.dragEnter(screen.queryByTestId('dropzone-container'))
      fireEvent.dragLeave(screen.queryByTestId('dropzone-container'))

      await waitFor(() => expect(screen.queryByText('Send')).not.toBeInTheDocument())
    })

    it('triggers onDrop function after a file has been uploaded', async () => {
      const file = new File(['file'], 'test.png', { type: 'image/png' })
      renderComponent({ onDrop, forceDisplay: false })

      fireEvent.dragEnter(screen.queryByTestId('dropzone-container'))
      const uploader = screen.getByText('Send')

      fireEvent.drop(uploader, {
        target: {
          files: [file],
        },
      })

      expect(onDrop).toHaveBeenCalledTimes(1)
    })
  })
})
