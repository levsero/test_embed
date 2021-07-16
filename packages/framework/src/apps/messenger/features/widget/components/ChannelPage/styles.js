import styled, { css } from 'styled-components'

import { MessengerIcon, WhatsAppIcon, InstagramIcon } from '@zendesk/conversation-components'

const Container = styled.div`
  display: flex;
  height: 100%;
`

const Body = styled.body`
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
  Body,
  Title,
  StyledFBMessengerIcon as MessengerIcon,
  StyledWhatsAppIcon as WhatsAppIcon,
  StyledInstagramIcon as InstagramIcon,
  StyledHeader as Header,
}
