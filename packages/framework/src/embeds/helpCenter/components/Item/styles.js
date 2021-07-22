import styled from 'styled-components'
import { zdColorGrey800 } from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'src/constants/shared'
import { isMobileBrowser } from 'src/util/devices'

export const ListItem = styled.li`
  color: ${zdColorGrey800};
  list-style: decimal;
  font-size: ${14 / FONT_SIZE}rem;
  margin-bottom: ${7 / FONT_SIZE}rem;
  padding-left: ${2 / FONT_SIZE}rem;

  &:last-child {
    margin-bottom: 0;
  }
  ${isMobileBrowser() &&
  `
    font-size: ${15 / FONT_SIZE}rem;
 `}
`

export const ArticleLink = styled.a`
  color: ${(props) => props.theme.listColorStr} !important;
  :hover,
  :active,
  :focus {
    color: ${(props) => props.theme.listHighlightColorStr} !important;
  }
`
