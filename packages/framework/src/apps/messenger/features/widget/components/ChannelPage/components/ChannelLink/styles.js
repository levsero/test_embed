import styled from 'styled-components'
import { rem } from 'polished'
import { Button, Anchor } from '@zendeskgarden/react-buttons'

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: ${(props) => props.theme.messenger.fontSizes.md};
  line-height: ${(props) => props.theme.messenger.lineHeights.md};
`

const QRCodeWrapper = styled.div`
  width: ${(props) => rem(140, props.theme.baseFontSize)};
  height: ${(props) => rem(140, props.theme.baseFontSize)};
  border: ${(props) => props.theme.borders.sm} ${(props) => props.theme.palette.grey[300]};
  border-radius: ${(props) => rem(4, props.theme.baseFontSize)};
  /*
    Unset removes default width/height from qrcode.react
    Otherwise, it messes up our centering for FB/Instagram
    But by removing this, we rely on viewbox ratio
    The QR code img provided by SunCo contains padding,
    so we only add it to Messenger and Instagram
  */
  svg {
    width: unset;
    height: unset;
    padding: ${(props) => props.theme.messenger.space.xs};
  }

  img {
    width: 100%;
    height: auto;
  }
`

const ChannelLinkButton = styled(Anchor)`
  &&& {
    color: ${(props) => props.theme.palette.black};

    &:focus {
      text-decoration: underline;
    }
  }
`

const ChannelPillButton = styled(Button)`
  background-color: ${(props) => props.theme.messenger.colors.action};
`

export { Content, QRCodeWrapper, ChannelLinkButton, ChannelPillButton }
