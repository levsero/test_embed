import styled, { css } from 'styled-components'

import FBMessengerSVG from 'src/apps/messenger/icons/messenger.svg'
import WhatsAppSVG from 'src/apps/messenger/icons/whatsapp.svg'
import InstagramSVG from 'src/apps/messenger/icons/instagram.svg'

import { IconButton } from '@zendeskgarden/react-buttons'

const Container = styled.div`
  /* background: lightblue; */
`

const sharedIconStyle = css`
  width: 10% !important;
  height: 10% !important;
`
const StyledFBMessengerIcon = styled(FBMessengerSVG)`
  ${sharedIconStyle}
`

const StyledWhatsAppIcon = styled(WhatsAppSVG)`
  ${sharedIconStyle}
`
const StyledInstagramIcon = styled(InstagramSVG)`
  ${sharedIconStyle}
`

const StyledButton = styled(IconButton)``

export {
  Container,
  StyledFBMessengerIcon as FBMessengerIcon,
  StyledWhatsAppIcon as WhatsAppIcon,
  StyledInstagramIcon as InstagramIcon,
  StyledButton as BackButton,
}
