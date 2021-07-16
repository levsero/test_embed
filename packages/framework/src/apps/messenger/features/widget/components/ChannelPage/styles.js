import styled, { css } from 'styled-components'

import { MessengerIcon, WhatsAppIcon, InstagramIcon } from '@zendesk/conversation-components'

const Container = styled.div`
  /* background: lightblue; */
`

const sharedIconStyle = css`
  width: 10% !important;
  height: 10% !important;
`
const StyledFBMessengerIcon = styled(MessengerIcon)`
  ${sharedIconStyle}
`

const StyledWhatsAppIcon = styled(WhatsAppIcon)`
  ${sharedIconStyle}
`
const StyledInstagramIcon = styled(InstagramIcon)`
  ${sharedIconStyle}
`

const StyledHeader = styled.div`
  position: fixed;
`

export {
  Container,
  StyledFBMessengerIcon as MessengerIcon,
  StyledWhatsAppIcon as WhatsAppIcon,
  StyledInstagramIcon as InstagramIcon,
  StyledHeader as Header,
}
