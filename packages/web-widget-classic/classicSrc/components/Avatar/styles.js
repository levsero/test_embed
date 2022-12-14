import { FONT_SIZE } from 'classicSrc/constants/shared'
import styled from 'styled-components'
import { zdColorGrey500 } from '@zendeskgarden/css-variables'

export const Image = styled.img`
  display: block !important;
  padding: 0 !important;
  text-align: center !important;
  border-radius: 50%;
  background-color: ${zdColorGrey500};
  height: ${32 / FONT_SIZE}rem;
  width: ${32 / FONT_SIZE}rem;
`
