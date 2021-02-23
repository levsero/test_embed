import render from 'src/utils/test/render'
import Timestamp from '../'

describe('Timestamp', () => {
  const defaultProps = {
    timestamp: new Date('11:59 PM September 28, 2020').getTime(),
  }

  const renderComponent = (props = {}) => {
    return render(<Timestamp {...defaultProps} {...props} />)
  }

  it('renders the timestamp in a human readable format', () => {
    const { getByText } = renderComponent()
    expect(getByText('September 28, 11:59 PM')).toBeInTheDocument()
  })
})
