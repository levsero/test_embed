import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import QRCode from 'qrcode.react'

import { getIsVerticallySmallScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import { Content, StyledChannelLink, StyledChannelButton } from './styles'
import { channelOptions } from '../../'

const ChannelLink = ({ channelId, url, qrCode }) => {
  const isVerticallySmallScreen = useSelector(getIsVerticallySmallScreen)
  const { instructions, button } = channelOptions[channelId]

  return (
    <>
      {!isVerticallySmallScreen && (
        <Content>
          <p>{instructions.desktop}</p>
          {qrCode ? (
            <img src={qrCode} alt={`QR code for channel linking to ${channelId}`} />
          ) : (
            <QRCode data-testid="generatedQRCode" value={url} renderAs="svg" />
          )}
          <StyledChannelLink href={url} target="_blank">
            {button.desktop}
          </StyledChannelLink>
        </Content>
      )}
      {isVerticallySmallScreen && (
        <Content>
          <p>{instructions.mobile}</p>
          <StyledChannelButton isPrimary={true} isPill={true} href={url} target="_blank">
            {button.mobile}
          </StyledChannelButton>
        </Content>
      )}
    </>
  )
}

export default ChannelLink

ChannelLink.propTypes = {
  channelId: PropTypes.string,
  url: PropTypes.string.isRequired,
  qrCode: PropTypes.string,
}
