import { render } from 'src/util/testHelpers'
import GreetingMessage from 'embeds/chat/components/PrechatForm/GreetingMessage'

describe('GreetingMessage', () => {
  const defaultProps = {
    message: 'Some message',
  }

  const renderComponent = (props = {}) => render(<GreetingMessage {...defaultProps} {...props} />)

  it('displays the message', () => {
    const { queryByText } = renderComponent({ message: 'This is a message' })

    expect(queryByText('This is a message')).toBeInTheDocument()
  })

  it('renders all links as external anchor tags', () => {
    const { container } = renderComponent({
      message: 'Text1 www.example.com/one Text2 www.example.com/two',
    })

    const children = container.querySelector('.Linkify').childNodes

    const [text1, link1, text2, link2] = children

    expect(text1.nodeValue).toEqual(expect.stringContaining('Text1'))
    expect(text2.nodeValue).toEqual(expect.stringContaining('Text2'))

    expect(link1).toHaveProperty('href', 'http://www.example.com/one')
    expect(link1).toHaveProperty('target', '_blank')

    expect(link2).toHaveProperty('href', 'http://www.example.com/two')
    expect(link2).toHaveProperty('target', '_blank')
  })
})
