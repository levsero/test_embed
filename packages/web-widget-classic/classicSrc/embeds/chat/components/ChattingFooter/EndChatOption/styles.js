import Icon from 'classicSrc/embeds/chat/icons/widget-icon_endChat.svg'
import styled from 'styled-components'

const StyledIcon = styled(Icon)`
  display: inline-block;

  ${(props) => props.theme.isMobile && 'padding: 0;'}
`

export { StyledIcon as Icon }
