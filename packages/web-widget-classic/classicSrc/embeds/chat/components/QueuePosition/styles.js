import { FONT_SIZE } from 'classicSrc/constants/shared'
import styled from 'styled-components'
import { zdColorGrey600 } from '@zendeskgarden/css-variables'

const Container = styled.div`
  text-align: center !important;
  margin-top: ${5 / FONT_SIZE}rem;
  margin-bottom: ${10 / FONT_SIZE}rem;
  color: ${zdColorGrey600};
`

export { Container }
