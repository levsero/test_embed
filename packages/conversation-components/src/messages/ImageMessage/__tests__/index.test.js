import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MESSAGE_STATUS } from 'src/constants'
import render from 'src/utils/test/render'
import ImageMessage from '../'

const renderComponent = (props = {}) => {
  const defaultProps = { mediaUrl: 'imgsrc.jpg' }
  return render(<ImageMessage {...defaultProps} {...props} />)
}
describe('ImageMessage', () => {
  it('renders the image', () => {
    const { getByAltText } = renderComponent({ alt: 'img alt' })

    expect(getByAltText('img alt')).toBeInTheDocument()
  })

  it('renders the image text', () => {
    const { getByText } = renderComponent({
      text: 'Some message',
    })

    expect(getByText('Some message')).toBeInTheDocument()
  })

  it('uses the mediaUrl as the src if src is not provided', () => {
    const { getByAltText } = renderComponent({
      alt: 'alt text',
      mediaUrl: 'some-image.jpg',
      src: undefined,
    })

    expect(getByAltText('alt text')).toHaveAttribute('src', 'some-image.jpg')
  })

  it('uses the src prop if provided', () => {
    const { getByAltText } = renderComponent({
      alt: 'alt text',
      mediaUrl: 'some-image.jpg',
      src: 'alternative-image.jpg',
    })

    expect(getByAltText('alt text')).toHaveAttribute('src', 'alternative-image.jpg')
  })

  describe('when in a sent state', () => {
    it('displays "open in a new tab" when focused', async () => {
      const { getByText } = renderComponent({
        text: 'Some message',
      })
      const imageText = getByText('Open in a new tab').closest('div')
      expect(imageText).toBeInTheDocument()
      expect(imageText).toHaveStyleRule('display, none')
      await imageText.focus()
      expect(imageText).toHaveStyleRule('display, flex')
    })

    it('displays "open in a new tab" when hovering', async () => {
      const { getByText } = renderComponent({
        text: 'Some message',
      })
      const imageText = getByText('Open in a new tab').closest('div')
      expect(imageText).toBeInTheDocument()
      expect(imageText).toHaveStyleRule('display, none')
      userEvent.hover(imageText)
      expect(imageText).toHaveStyleRule('display, flex')
    })
  })

  describe('when in a sending state', () => {
    it('does not support opening the image in a new tab', async () => {
      const { queryByText } = renderComponent({
        text: 'Some message',
        status: MESSAGE_STATUS.sending,
      })
      expect(queryByText('Open in a new tab')).not.toBeInTheDocument()
    })
  })

  describe('when in a failed state', () => {
    it('does not support opening the image in a new tab', async () => {
      const { queryByText } = renderComponent({
        text: 'Some message',
        status: MESSAGE_STATUS.failed,
      })
      expect(queryByText('Open in a new tab')).not.toBeInTheDocument()
    })
  })

  it("calls the onError callback when it can't load the image", () => {
    const onError = jest.fn()
    const { getByAltText } = renderComponent({ onError, alt: 'img alt', mediaUrl: 'blahurl.com' })
    fireEvent.error(getByAltText('img alt'))
    expect(onError).toHaveBeenCalled()
  })
})
