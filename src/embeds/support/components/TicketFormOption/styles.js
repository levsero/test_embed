import styled from 'styled-components'

import { FONT_SIZE } from 'constants/shared'
import { zdColorGrey200, zdColorGrey100 } from '@zendeskgarden/css-variables'
import { isMobileBrowser } from 'utility/devices'

const mobileStyles = `
  padding: ${24 / FONT_SIZE}rem ${20 / FONT_SIZE}rem !important;
  font-size: ${15 / FONT_SIZE}rem;

  &:hover,
  &:focus,
  &:active {
    background: ${zdColorGrey100};
  }
`

export const ListItem = styled.li`
  color: ${({ theme }) => `${theme.listColorStr} !important`};
  fill: ${({ theme }) => `${theme.listColorStr} !important`};
  text-decoration-color: ${({ theme }) => `${theme.baseColor} !important`};
  border-bottom: ${1.1 / FONT_SIZE}rem solid ${zdColorGrey200};
  padding: ${18 / FONT_SIZE}rem 0 !important;
  line-height: ${18 / FONT_SIZE};
  list-style: none;
  cursor: pointer !important;

  &:hover,
  &:focus,
  &:active {
    text-decoration: underline;
    color: ${({ theme }) => `${theme.listHighlightColorStr} !important`};
    fill: ${({ theme }) => `${theme.listHighlightColorStr} !important`};
  }

  &:last-child {
    border: none;
  }

  ${isMobileBrowser() && mobileStyles}
`
