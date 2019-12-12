import styled from 'styled-components'
import cssVariables from '@zendeskgarden/css-variables'
import { FONT_SIZE } from 'constants/shared'

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: ${120 / FONT_SIZE}rem;
  left: 0;
  right: 0;
`

const Text = styled.div`
  color: ${cssVariables.zdColorGrey800};
  border-radius: ${30 / FONT_SIZE}rem !important;
  box-shadow: 0 ${1 / FONT_SIZE}rem ${10 / FONT_SIZE}rem 0 rgba(0, 0, 0, 0.2);
  max-width: 90%;
  height: ${30 / FONT_SIZE}rem;
  line-height: ${30 / FONT_SIZE}rem;
  padding: 0 ${12 / FONT_SIZE}rem;
  background-color: ${cssVariables.zdColorWhite};
  transition: opacity 300ms ease-in-out;
  opacity: 0;
`

export { Container, Text }
