import { FONT_SIZE } from 'classicSrc/constants/shared'
import styled from 'styled-components'
import { zdColorWhite, zdColorGrey800 } from '@zendeskgarden/css-variables'

const Container = styled.div`
  background-color: ${zdColorWhite};
  padding: ${16 / FONT_SIZE}rem 0;
`

const Title = styled.h3`
  text-align: center;
  margin-bottom: ${10 / FONT_SIZE}rem;
  font-size: ${13 / FONT_SIZE}rem;
  font-weight: normal;
  color: ${zdColorGrey800};
`

export { Container, Title }
