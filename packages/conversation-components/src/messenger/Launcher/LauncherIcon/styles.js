import styled from 'styled-components'
import CloseIconSVG from './close-icon.svg'
import MessengerIconSVG from './messenger_open.svg'

const CloseIcon = styled(CloseIconSVG)`
  height: 100% !important;
  width: 100% !important;
  g {
    fill: ${(props) => props.theme.messenger.colors.primaryText};
  }
`

const MessengerIcon = styled(MessengerIconSVG)`
  width: 60% !important;
  height: 60% !important;
  path {
    fill: ${(props) => props.theme.messenger.colors.primaryText};
  }

  ${(props) =>
    props.position === 'left' &&
    `
    transform: scaleX(-1);
  `}
`

export { CloseIcon, MessengerIcon }
