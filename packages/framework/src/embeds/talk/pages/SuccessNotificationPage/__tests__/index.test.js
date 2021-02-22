jest.mock('utility/devices')

import { render } from 'src/util/testHelpers'

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
