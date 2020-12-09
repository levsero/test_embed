import styled, { css } from 'styled-components'

import { zdColorGrey800 } from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'constants/shared'
import { isMobileBrowser } from 'utility/devices'

export const Container = styled.div`
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  display: table;
  margin: 0;
  min-width: 100%;
  padding: 0;
  table-layout: auto;
  padding-top: ${5 / FONT_SIZE}rem !important;
  font-weight: 700;
  color: ${zdColorGrey800};
  font-size: ${14 / FONT_SIZE}rem !important;
  ${isMobileBrowser() &&
    css`
      font-size: ${15 / FONT_SIZE}rem;
    `}
`

export const Content = styled.h2`
  vertical-align: middle;
  font-size: ${15 / FONT_SIZE}rem;
`