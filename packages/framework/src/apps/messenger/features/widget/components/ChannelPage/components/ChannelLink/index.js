import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { getIsVerticallySmallScreen } from 'src/apps/messenger/features/responsiveDesign/store'

const ChannelLink = ({ channelId, url, qrCode }) => {
  const isVerticallySmallScreen = useSelector(getIsVerticallySmallScreen)

  return (
    <>
      {!isVerticallySmallScreen && (
        <div>
          <h2>DESKTOP</h2>
          <p>Scan the QR code and then send the message that appears in your {channelId}</p>
          {qrCode && <img src={qrCode} alt={`QR code for channel linking to ${channelId}`} />}
          <a href={url} target="_blank">
            Open {channelId} on this device
          </a>
        </div>
      )}
      {isVerticallySmallScreen && (
        <div>
          <h2>MOBILE</h2>
          <p>Open {channelId} and send a short message to connect your account.</p>
          <a href={url} target="_blank">
            Open {channelId}
          </a>
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
