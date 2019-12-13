import styled from 'styled-components'
import { zdColorBlack, zdColorWhite, zdColorOil } from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'src/constants/shared'

const Container = styled.div`
  background-color: ${zdColorWhite};
  box-shadow: 0 ${2 / FONT_SIZE}rem ${16 / FONT_SIZE}rem 0 rgba(${zdColorBlack}, 0.26);
  padding: ${16 / FONT_SIZE}rem 0;
`

const Title = styled.h3`
  text-align: center;
  margin-bottom: ${10 / FONT_SIZE}rem;
  font-size: ${13 / FONT_SIZE}rem;
  font-weight: normal;
  color: ${zdColorOil};
`

export { Container, Title }
