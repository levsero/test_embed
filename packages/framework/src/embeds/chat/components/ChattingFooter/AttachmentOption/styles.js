import styled from 'styled-components'
import Icon from '@zendeskgarden/svg-icons/src/14/attachment.svg'

const StyledIcon = styled(Icon)`
  &&& {
    display: inline-block;

    min-width: ${props => 16 / props.theme.fontSize}rem;
    min-height: ${props => 16 / props.theme.fontSize}rem;
    height: ${props => 16 / props.theme.fontSize}rem;
    width: ${props => 16 / props.theme.fontSize}rem;
    transform-origin: center;
    transform: rotate(45deg);
  }
`

export { StyledIcon as Icon }
