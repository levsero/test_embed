import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import QRCode from 'qrcode.react'

import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import {
  Content,
  Instructions,
  QRCodeWrapper,
  ChannelLinkButton,
  ChannelPillButton,
} from './styles'
import { channelOptions } from '../../'

const ChannelLink = ({ channelId, url, qrCode }) => {
  const isFullScreen = useSelector(getIsFullScreen)
  const { instructions, button } = channelOptions[channelId]

  return (
    <Content>
      {!isFullScreen && (
        <>
          <Instructions>{instructions.desktop}</Instructions>
          <QRCodeWrapper>
            {qrCode ? (
              <img src={qrCode} alt={`QR code for channel linking to ${channelId}`} />
            ) : (
              <QRCode data-testid="generatedQRCode" value={url} renderAs="svg" />
            )}
          </QRCodeWrapper>
          <ChannelLinkButton href={url} target="_blank">
            {button.desktop}
          </ChannelLinkButton>
        </>
      )}
      {isFullScreen && (
        <>
          <Instructions>{instructions.mobile}</Instructions>
          <ChannelPillButton isPrimary={true} isPill={true} href={url} target="_blank">
            {button.mobile}
          </ChannelPillButton>
        </>
      )}
    </Content>
  )
}

export default ChannelLink

ChannelLink.propTypes = {
  channelId: PropTypes.string,
  url: PropTypes.string.isRequired,
  qrCode: PropTypes.string,
}
