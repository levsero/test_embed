import { rem, darken } from 'polished'
import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import { Spinner } from '@zendeskgarden/react-loaders'
import CheckLGStroke from '@zendeskgarden/svg-icons/src/12/check-lg-stroke.svg'
import ReloadStroke from '@zendeskgarden/svg-icons/src/12/reload-stroke.svg'

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

const QRSpaceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => rem(140, props.theme.baseFontSize)};
  height: ${(props) => rem(140, props.theme.baseFontSize)};
  border-radius: ${(props) => rem(4, props.theme.baseFontSize)};
  margin-bottom: ${(props) => props.theme.messenger.space.lg};
`

const QRCodeWrapper = styled(QRSpaceContainer)`
  border: ${(props) => props.theme.borders.sm} ${(props) => props.theme.palette.grey[300]};
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

const ChannelPillButton = styled(Button)`
  &&& {
    position: relative;
    background-color: ${(props) => props.theme.messenger.colors.action};
    margin-bottom: ${(props) => props.theme.messenger.space.lg};

    :hover {
      background-color: ${(props) => darken(0.1, props.theme.messenger.colors.action)};
    }
  }
`

const HiddenText = styled.span`
  visibility: hidden;
`

const ButtonSpinnerContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin: 0;
  }
`

const IconPositioning = styled.div`
  display: flex;
  align-items: center;
  min-width: 24px;
`

const UnlinkText = styled.p`
  margin-right: ${(props) => props.theme.messenger.space.xs};
`

const LinkTickIcon = styled(CheckLGStroke)`
  margin-right: ${(props) => props.theme.messenger.space.sm};
`

const DisconnectContainer = styled.div`
  display: flex;
`

const LoadingSpinner = styled(Spinner)`
  margin-right: ${(props) => props.theme.messenger.space.sm};
`

const BigLoadingSpinner = styled(Spinner)`
  margin-top: ${(props) => props.theme.messenger.space.lg};
`

const LinkErrorText = styled.p`
  color: inherit;
  font-weight: ${(props) => props.theme.messenger.fontWeights.semibold};
`

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${(props) => props.theme.messenger.space.lg};
`

const StyledReloadStroke = styled(ReloadStroke)`
  margin-left: ${(props) => props.theme.messenger.space.xs};
  margin-right: ${(props) => props.theme.messenger.space.xs};
  margin-top: ${(props) => props.theme.messenger.space.xxs};
`

const RetryPositioning = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export {
  BigLoadingSpinner,
  ChannelIcon,
  ChannelPillButton,
  Container,
  Content,
  DisconnectContainer,
  ErrorContainer,
  IconPositioning,
  Instructions,
  LinkErrorText,
  LinkTickIcon,
  LoadingSpinner,
  QRCodeWrapper,
  StyledReloadStroke as ReloadStroke,
  RetryPositioning,
  Subtitle,
  Title,
  UnlinkText,
  QRSpaceContainer,
  ButtonSpinnerContainer,
  HiddenText,
}
