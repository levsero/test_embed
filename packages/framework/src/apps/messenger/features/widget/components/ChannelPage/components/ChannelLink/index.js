import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { getIsVerticallySmallScreen } from 'src/apps/messenger/features/responsiveDesign/store'

const ChannelLink = ({ channelId, url, qrCode }) => {
  const isVerticallySmallScreen = useSelector(getIsVerticallySmallScreen)

  return (
    <>
      Hello {`${channelId}`}
      <a href={url}>Click me</a>
      {!isVerticallySmallScreen && (
        <div>
          <h2>DESKTOP</h2>
          <a href={url} target="_blank">
            Open {channelId}
          </a>
          <br />
          {qrCode && <img src={qrCode} alt={`QR code for channel linking to ${channelId}`} />}
        </div>
      )}
      {isVerticallySmallScreen && (
        <div>
          <h2>MOBILE</h2>
          <a href={url} target="_blank">
            Button
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
