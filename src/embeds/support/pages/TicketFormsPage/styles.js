import styled from 'styled-components'
import { zdColorGrey800, zdColorGrey200, zdColorGrey100 } from '@zendeskgarden/css-variables'

import { isMobileBrowser } from 'utility/devices'
import { FONT_SIZE } from 'constants/shared'

const ticketFormListMobileStyles = `
  padding-left: ${20 / FONT_SIZE}rem !important;
  padding-right: ${20 / FONT_SIZE}rem !important;
  padding-bottom: ${24 / FONT_SIZE}rem;
  font-size: ${15 / FONT_SIZE}rem;

  &:hover,
  &:focus,
  &:active {
    background: ${zdColorGrey100};
  }
`

export const TicketFormOption = styled.li`
  color: ${({ theme }) => `${theme.listColorStr} !important`};
  fill: ${({ theme }) => `${theme.listColorStr} !important`};
  text-decoration-color: ${({ theme }) => `${theme.baseColor} !important`};
  border-bottom: ${1.1 / FONT_SIZE}rem solid ${zdColorGrey200};
  padding-top: ${18 / FONT_SIZE}rem;
  padding-bottom: ${18 / FONT_SIZE}rem;
  padding-left: 0 !important;
  padding-right: 0 !important;
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

  ${isMobileBrowser() && ticketFormListMobileStyles + `padding-top: ${24 / FONT_SIZE}rem;`}
`

export const HeaderTitle = styled.h2`
  padding-left: 0 !important;
  padding-right: 0 !important;
  border-bottom: ${1.1 / FONT_SIZE}rem solid ${zdColorGrey200};
  padding-bottom: ${16 / FONT_SIZE}rem;
  color: ${zdColorGrey800};
  font-size: ${14 / FONT_SIZE}rem;
  font-weight: 700;

  ${isMobileBrowser() && ticketFormListMobileStyles}
`
