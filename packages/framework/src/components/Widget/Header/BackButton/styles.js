import styled from 'styled-components'
import { zdColorWhite } from '@zendeskgarden/css-variables'
import BackIcon from 'src/asset/icons/widget-icon_back.svg'

export const StyledBackIcon = styled(BackIcon)`
  fill: ${zdColorWhite};
  ${(props) =>
    props.theme.rtl &&
    `path {
    transform: rotate(180deg);
    transform-origin: 50% 50%;
  }`}
`

export { StyledBackIcon as BackIcon }
