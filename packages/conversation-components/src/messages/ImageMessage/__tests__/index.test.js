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

  it('open in a new tab has the correct css display value', async () => {
    const { getByText } = renderComponent({
      text: 'Some message',
    })
    const imageText = getByText('Open in a new tab')
    expect(imageText).toBeInTheDocument()
    expect(imageText).toHaveStyleRule('display, none')
    await imageText.focus()
    expect(imageText).toHaveStyleRule('display, block')
  })
})
