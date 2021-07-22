import styled from 'styled-components'
import { zdColorGrey600 } from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'src/constants/shared'

const Container = styled.div`
  text-align: center !important;
  margin-top: ${5 / FONT_SIZE}rem;
  margin-bottom: ${10 / FONT_SIZE}rem;
  color: ${zdColorGrey600};
`

export { Container }
