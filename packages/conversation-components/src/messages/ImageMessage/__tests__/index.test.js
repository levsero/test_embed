import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('displays "open in a new tab" when hovering', () => {
    const { getByText } = renderComponent({
      text: 'Some message',
    })
    const imageText = getByText('Open in a new tab').closest('div')
    expect(imageText).toBeInTheDocument()
    expect(imageText).toHaveStyleRule('display, none')
    userEvent.hover(imageText)
    expect(imageText).toHaveStyleRule('display, flex')
  })

  it("calls the onError callback when it can't load the image", () => {
    const onError = jest.fn()
    const { getByAltText } = renderComponent({ onError, alt: 'img alt', mediaUrl: 'blahurl.com' })
    fireEvent.error(getByAltText('img alt'))
    expect(onError).toHaveBeenCalled()
  })
})
