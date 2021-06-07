import { render } from 'src/apps/messenger/utils/testHelpers'
import CarouselStructuredMessage from '../CarouselStructuredMessage'

const renderComponent = (props = {}) => {
  const defaultProps = {
    message: {
      isFirstMessageInAuthorGroup: true,
      isLastMessageInAuthorGroup: true,
      name: 'Test Name',
      avatarUrl: 'someUrl',
      items: [
        {
          _id: 'First Test Id',
          title: 'Test Article',
          description: 'Test Description',
        },
      ],
    },
  }
  return render(<CarouselStructuredMessage {...defaultProps} {...props} />)
}

describe('CarouselStructuredMessage', () => {
  it('displays the header and description of given items', () => {
    const { getByText } = renderComponent({
      message: {
        items: [
          {
            _id: 'test id',
            title: 'Hello World',
            description: "Hey friend, here's a specific case!",
          },
          {
            _id: 'second test',
            title: 'Second World',
            description: "Hey friend, here's another specific case!",
          },
        ],
      },
    })

    expect(getByText('Hello World')).toBeInTheDocument()
    expect(getByText("Hey friend, here's a specific case!")).toBeInTheDocument()
    expect(getByText('Second World')).toBeInTheDocument()
    expect(getByText("Hey friend, here's another specific case!")).toBeInTheDocument()
  })
})
