import { render } from 'src/util/testHelpers'
import SuccessNotificationPage from '../'

jest.mock('utility/devices')

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
