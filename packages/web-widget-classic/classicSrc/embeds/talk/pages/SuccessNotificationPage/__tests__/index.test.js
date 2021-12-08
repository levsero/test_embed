import { render } from 'classicSrc/util/testHelpers'
import SuccessNotificationPage from '../'

const defaultProps = {
  title: 'Request sent',
}

const renderComponent = (props = {}) => {
  return render(<SuccessNotificationPage {...defaultProps} {...props} />)
}

describe('SuccessNotificationPage', () => {
  it('renders', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })
})
