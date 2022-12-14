import ArrowDownIcon from 'classicSrc/asset/icons/widget-icon_arrow-down-stroke.svg'
import { FONT_SIZE } from 'classicSrc/constants/shared'
import styled from 'styled-components'
import { zdColorGrey800 } from '@zendeskgarden/css-variables'

const StyledArrowDownIcon = styled(ArrowDownIcon)`
  height: ${16 / FONT_SIZE}rem;
  min-height: ${16 / FONT_SIZE}rem; /* 1 */
  min-width: ${16 / FONT_SIZE}rem; /* 1 */
  padding-left: ${5 / FONT_SIZE}rem;
  position: relative;
  top: ${1 / FONT_SIZE}rem;
  vertical-align: text-top;
  width: ${16 / FONT_SIZE}rem;
  .lines {
    stroke: ${zdColorGrey800};
  }

  ${(props) =>
    props.theme.rtl &&
    `padding-left: 0 !important;
    padding-right: ${5 / FONT_SIZE}rem !important;`}
`

export { StyledArrowDownIcon as ArrowDownIcon }
