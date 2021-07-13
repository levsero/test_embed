import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { getIsVerticallySmallScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import { StyledChannelLink, StyledChannelButton } from './styles'

const ChannelLink = ({ channelId, url, qrCode }) => {
  const isVerticallySmallScreen = useSelector(getIsVerticallySmallScreen)

  return (
    <>
      {!isVerticallySmallScreen && (
        <div>
          {channelId !== 'instagram' && (
            <p>Scan the QR code and then send the message that appears in your {channelId}</p>
          )}
          {channelId === 'instagram' && (
            <p>Scan the QR code to open Instagram. Follow @[Instagram handle] to send a DM.</p>
          )}
          {qrCode && <img src={qrCode} alt={`QR code for channel linking to ${channelId}`} />}
          <StyledChannelLink href={url} target="_blank">
            Open {channelId} on this device
          </StyledChannelLink>
          <p>[DESKTOP]</p>
        </div>
      )}
      {isVerticallySmallScreen && (
        <div>
          {channelId !== 'instagram' && (
            <p>Open {channelId} and send a short message to connect your account.</p>
          )}
          {channelId === 'instagram' && <p>Follow @[Instagram handle] to send a DM.</p>}
          <StyledChannelButton isPrimary={true} isPill={true} href={url} target="_blank">
            Open {channelId}
          </StyledChannelButton>
          <p>[MOBILE]</p>
        </div>
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
