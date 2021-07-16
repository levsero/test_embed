import styled, { css } from 'styled-components'

import { MessengerIcon, WhatsAppIcon, InstagramIcon } from '@zendesk/conversation-components'

const Container = styled.div`
  display: flex;
  height: 100%;
`

const Header = styled.div`
  position: fixed;
`

// Semantically, this should probably be <main>
const Body = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  flex-direction: column;
`

const Title = styled.h1`
  font-size: ${(props) => props.theme.messenger.fontSizes.lg};
  line-height: ${(props) => props.theme.messenger.lineHeights.lg};
`

const Subtitle = styled.p`
  font-size: ${(props) => props.theme.messenger.fontSizes.md};
  line-height: ${(props) => props.theme.messenger.lineHeights.md};
`

const sharedIconStyle = css`
  width: 10% !important;
  height: 10% !important;
`
const StyledMessengerIcon = styled(MessengerIcon)`
  ${sharedIconStyle}
`

const StyledWhatsAppIcon = styled(WhatsAppIcon)`
  ${sharedIconStyle}
`
const StyledInstagramIcon = styled(InstagramIcon)`
  ${sharedIconStyle}
`

export {
  Container,
  Body,
  Header,
  Title,
  Subtitle,
  StyledMessengerIcon as MessengerIcon,
  StyledWhatsAppIcon as WhatsAppIcon,
  StyledInstagramIcon as InstagramIcon,
}
