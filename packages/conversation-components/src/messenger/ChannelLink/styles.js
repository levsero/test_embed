import { rem } from 'polished'
import styled from 'styled-components'
import { Button, Anchor } from '@zendeskgarden/react-buttons'

const Container = styled.div`
  font-family: ${(props) => props.theme.messenger.fontFamily};
  max-width: ${(props) => rem(640, props.theme.baseFontSize)};
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 ${(props) => props.theme.messenger.space.lg};
`

const Title = styled.h1`
  font-size: ${(props) => props.theme.messenger.fontSizes.lg};
  line-height: ${(props) => props.theme.messenger.lineHeights.lg};
  margin-bottom: ${(props) => props.theme.messenger.space.xs};
  font-weight: normal;
`

const Subtitle = styled.p`
  font-size: ${(props) => props.theme.messenger.fontSizes.md};
  line-height: ${(props) => props.theme.messenger.lineHeights.md};
  margin-bottom: ${(props) => props.theme.messenger.space.md};
`

const ChannelIcon = styled.div`
  height: ${(props) => props.theme.messenger.iconSizes.xl};
  width: ${(props) => props.theme.messenger.iconSizes.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.messenger.space.md};

  svg,
  img {
    height: ${(props) => props.theme.messenger.iconSizes.xl};
    width: ${(props) => props.theme.messenger.iconSizes.xl};
  }
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: ${(props) => props.theme.messenger.fontSizes.md};
  line-height: ${(props) => props.theme.messenger.lineHeights.md};
`

const Instructions = styled.p`
  margin-bottom: ${(props) => props.theme.messenger.space.lg};
`

const QRCodeWrapper = styled.div`
  width: ${(props) => rem(140, props.theme.baseFontSize)};
  height: ${(props) => rem(140, props.theme.baseFontSize)};
  border: ${(props) => props.theme.borders.sm} ${(props) => props.theme.palette.grey[300]};
  border-radius: ${(props) => rem(4, props.theme.baseFontSize)};
  margin-bottom: ${(props) => props.theme.messenger.space.lg};
  /*
    Unset removes default width/height (128px) from qrcode.react
    Otherwise, it messes up centering for Messenger/Instagram
    But by removing this, we rely on viewbox ratio
    The QR code image for WhatsApp provided by SunCo contains
    padding, so we only add it to Messenger and Instagram
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

export {
  Container,
  Title,
  Subtitle,
  ChannelIcon,
  Content,
  Instructions,
  QRCodeWrapper,
  ChannelLinkButton,
  ChannelPillButton,
}
