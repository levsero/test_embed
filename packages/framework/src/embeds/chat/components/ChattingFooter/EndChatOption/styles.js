import styled from 'styled-components'
import Icon from 'embeds/chat/icons/widget-icon_endChat.svg'

const StyledIcon = styled(Icon)`
  display: inline-block;

  ${props => props.theme.isMobile && 'padding: 0;'}
`

export { StyledIcon as Icon }
