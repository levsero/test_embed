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
  it('displays a button with channel link url', () => {
    const { getByText } = renderComponent()

    expect(getByText('Open Messenger')).toBeInTheDocument()
  })

  describe('when we are on desktop', () => {
    it('should render a QR code', () => {
      jest
        .spyOn(responsiveDesignStore, 'getIsVerticallySmallScreen')
        .mockImplementation(() => false)
    })
    const { getByText } = renderComponent()

    expect(getByText('DESKTOP')).toBeInTheDocument()
  })
  describe('when we are on mobile', () => {
    it('should not render a QR code', () => {
      jest.spyOn(responsiveDesignStore, 'getIsVerticallySmallScreen').mockImplementation(() => true)
      const { getByText } = renderComponent()

      expect(getByText('MOBILE')).toBeInTheDocument()
    })
  })
})
