import styled from 'styled-components'
import Icon from 'embeds/chat/icons/widget-icon_sendChat.svg'

const StyledIcon = styled(Icon)`
  &&& {
    display: inline-block;
    padding: ${(props) => 10 / props.theme.fontSize}rem;
    color: ${(props) => props.theme.baseColor} !important;
  }
`

export { StyledIcon as Icon }
