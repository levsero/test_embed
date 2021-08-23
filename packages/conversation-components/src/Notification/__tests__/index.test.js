import Notification from '../'
import { NOTIFICATION_TYPES } from '../../constants'
import render from '../../utils/test/render'

describe('Notification', () => {
  it('renders a notification message', () => {
    const { getByText } = render(<Notification messageType={NOTIFICATION_TYPES.connectError} />)

    expect(getByText("Couldn't connect. Try again.")).toBeInTheDocument()
  })
})
