import { render } from 'src/apps/messenger/utils/testHelpers'
import * as responsiveDesignStore from 'src/apps/messenger/features/responsiveDesign/store'

import ChannelLink from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    channelId: 'messenger',
    url: 'www.awesomeurl.com',
  }

  return render(<ChannelLink {...defaultProps} {...props} />)
}

describe('ChannelLink', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('displays a button with channel link url', () => {
    const { getByText } = renderComponent()

    expect(getByText(/Open Messenger/i)).toBeInTheDocument()
  })

  describe('when we are on desktop', () => {
    it('should render a QR code', () => {
      jest
        .spyOn(responsiveDesignStore, 'getIsVerticallySmallScreen')
        .mockImplementation(() => false)
      const { getByTestId } = renderComponent()

      expect(getByTestId('generatedQRCode')).toBeInTheDocument()
    })
  })
  describe('when we are on mobile', () => {
    it('should not render a QR code', () => {
      jest.spyOn(responsiveDesignStore, 'getIsVerticallySmallScreen').mockImplementation(() => true)
      const { getByRole } = renderComponent()

      expect(getByRole('button')).toBeInTheDocument()
    })
  })
})
