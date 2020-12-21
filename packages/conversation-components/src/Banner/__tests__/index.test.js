import render from '../../utils/test/render'
import Banner from '../'
import { BANNER_STATUS } from '../../constants'

describe('Banner', () => {
  it('renders', () => {
    const defaultProps = {
      message: 'Some message',
      status: BANNER_STATUS.success
    }

    const renderComponent = (props = {}) => {
      return render(<Banner {...defaultProps} {...props} />)
    }

    expect(() => renderComponent()).not.toThrow()
  })
})
