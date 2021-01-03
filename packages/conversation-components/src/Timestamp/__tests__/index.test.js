import { parseTimestamp } from 'src/Timestamp'
import render from 'src/utils/test/render'
import Timestamp from '../'

describe('Timestamp', () => {
  const defaultProps = {
    millisecondsSinceEpoch: new Date('11:59 PM September 28, 2020').getTime()
  }

  const renderComponent = (props = {}) => {
    return render(<Timestamp {...defaultProps} {...props} />)
  }

  it('renders the timestamp in a human readable format', () => {
    const { getByText } = renderComponent()
    expect(getByText('September 28, 11:59 PM')).toBeInTheDocument()
  })
})

describe('parseTimestamp', () => {
  describe('if the timestamp is from the same day', () => {
    it('does not render date', () => {
      const date = new Date('11:59 PM September 28, 2020')
      const parsedDate = parseTimestamp(date.getTime(), date.getTime())

      expect(parsedDate).toEqual('11:59 PM')
    })
  })

  describe('if timestamp is not from the same day', () => {
    it('does render date', () => {
      const date = new Date('11:59 PM September 28, 2020')
      const parsedDate = parseTimestamp(date.getTime())

      expect(parsedDate).toEqual('September 28, 11:59 PM')
    })
  })
})
