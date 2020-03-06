import styled from 'styled-components'
import TwitterIcon from 'icons/widget-icon_twitter.svg'
import MessengerIcon from 'icons/widget-icon_messenger.svg'

const Container = styled.div`
  margin-bottom: ${props => 15 / props.theme.fontSize}rem;
`

const iconStyles = props => `
min-width: ${(props.mobile ? 40 : 24) / props.theme.fontSize}rem;
min-height: ${(props.mobile ? 40 : 24) / props.theme.fontSize}rem;
max-width: ${(props.mobile ? 40 : 24) / props.theme.fontSize}rem;
max-height: ${(props.mobile ? 40 : 24) / props.theme.fontSize}rem;
height: ${(props.mobile ? 40 : 24) / props.theme.fontSize}rem;
width: ${(props.mobile ? 40 : 24) / props.theme.fontSize}rem;
`

const ChannelIcon = styled.a`
  display: inline-block;
  padding-right: ${props => (props.isMobile ? 12 : 8) / props.theme.fontSize}rem;

  ${props =>
    props.theme.rtl &&
    `
    padding-right: 0;
    padding-left: ${(props.isMobile ? 12 : 8) / props.theme.fontSize}rem;
  `}
`

export const StyledTwitterIcon = styled(TwitterIcon)`
  ${iconStyles}
  path {
    fill: #1da1f2;
  }
`

const ButtonsContainer = styled.div`
  margin-top: ${props => 8 / props.theme.fontSize}rem;
`

const StyledMessengerIcon = styled(MessengerIcon)`
  ${iconStyles}

  path {
    fill: #0084ff;
  }
`

export {
  ButtonsContainer,
  ChannelIcon,
  Container,
  StyledMessengerIcon as MessengerIcon,
  StyledTwitterIcon as TwitterIcon
}
