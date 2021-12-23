import Icon from 'classicSrc/embeds/chat/icons/widget-icon_sendChat.svg'
import styled from 'styled-components'

const StyledIcon = styled(Icon)`
  &&& {
    display: inline-block;
    padding: ${(props) => 10 / props.theme.fontSize}rem;
    color: ${(props) => props.theme.baseColor} !important;
  }
`

export { StyledIcon as Icon }
