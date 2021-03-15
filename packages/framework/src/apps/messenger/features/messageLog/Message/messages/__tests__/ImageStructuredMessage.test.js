import { render } from 'src/apps/messenger/utils/testHelpers'
import ImageStructuredMessage from '../ImageStructuredMessage'

describe('ImageStructuredMessage', () => {
  const defaultProps = {
    message: {
      _id: '1',
    },
  }

  const renderComponent = (props = {}) => {
    return render(<ImageStructuredMessage {...defaultProps} {...props} />)
  }

  it('uses the altText value from the message', () => {
    const { queryByAltText } = renderComponent({
      message: {
        ...defaultProps,
        altText: 'This is alt text',
      },
    })

    expect(queryByAltText('This is alt text')).toBeInTheDocument()
  })
})
