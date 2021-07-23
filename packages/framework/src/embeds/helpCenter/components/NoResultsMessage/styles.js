import styled from 'styled-components'
import { zdColorGrey800, zdColorGrey600 } from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'src/constants/shared'
import { isMobileBrowser } from 'src/util/devices'

export const Container = styled.div`
  text-align: center !important;
  color: ${zdColorGrey800};
  font-size: ${15 / FONT_SIZE}rem;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  ${({ isBottom }) => isBottom && `padding-bottom: ${20 / FONT_SIZE}rem;`}
`

export const Title = styled.p`
  margin-bottom: 0 !important;
  margin-top: ${20 / FONT_SIZE} !important;
`

export const Paragraph = styled.p`
  color: ${zdColorGrey600};
  ${!isMobileBrowser() &&
  `
    margin-bottom: ${20 / FONT_SIZE} !important;
`}
`
