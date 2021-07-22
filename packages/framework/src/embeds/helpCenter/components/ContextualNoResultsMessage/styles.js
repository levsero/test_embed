import styled from 'styled-components'
import { zdColorGrey600 } from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'src/constants/shared'
import { isMobileBrowser } from 'utility/devices'

export const Container = styled.div`
  color: ${zdColorGrey600};
  align-items: center;
  display: flex;
  height: 100%;
  max-height: ${365 / FONT_SIZE}rem;
  text-align: center;
  margin-left: ${25 / FONT_SIZE}rem;
  margin-right: ${25 / FONT_SIZE}rem;

  ${isMobileBrowser() &&
  `
      font-size: ${16 / FONT_SIZE}rem;
    `}
`

export const Content = styled.p`
  margin-bottom: ${40 / FONT_SIZE}rem !important;
  line-height: ${() => (isMobileBrowser() ? `${18 / FONT_SIZE}` : `${22 / FONT_SIZE}`)}rem;
`
