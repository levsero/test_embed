import { FONT_SIZE } from 'classicSrc/constants/shared'
import styled from 'styled-components'
import { zdColorGrey200, zdColorGrey100 } from '@zendeskgarden/css-variables'
import { isMobileBrowser } from '@zendesk/widget-shared-services'

const mobileStyles = `
  font-size: ${15 / FONT_SIZE}rem;
  padding: ${25 / FONT_SIZE}rem ${12 / FONT_SIZE}rem !important;
`

export const Button = styled.button`
  border: 0;
  color: ${({ theme }) => `${theme.textColor} !important`};
  text-decoration-color: ${({ theme }) => `${theme.baseColor} !important`};
  border-bottom: ${1.1 / FONT_SIZE}rem solid ${zdColorGrey200};
  padding: ${18 / FONT_SIZE}rem ${12 / FONT_SIZE}rem !important;
  line-height: ${18 / FONT_SIZE};
  list-style: none;
  display: block;
  width: 100%;
  text-align: start;
  background-color: transparent;

  &:hover {
    cursor: pointer;
  }

  &:hover,
  &:focus,
  &:active {
    text-decoration: underline;
    color: ${({ theme }) => `${theme.textColor} !important`};
    background-color: ${zdColorGrey100};
  }

  &:not(:last-child) {
    border-bottom: ${1.1 / FONT_SIZE}rem solid ${zdColorGrey200};
  }

  ${isMobileBrowser() && mobileStyles}
`
