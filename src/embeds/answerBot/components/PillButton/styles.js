import styled from 'styled-components'
import { FONT_SIZE } from 'src/constants/shared'

const Button = styled.button`
  background-color: transparent;
  color: ${props => props.theme.buttonColorStr};
  border-color: ${props => props.theme.buttonColorStr};
  font-size: ${15 / FONT_SIZE}rem;
  padding-right: ${24 / FONT_SIZE}rem;
  padding-left: ${24 / FONT_SIZE}rem;
  min-width: 0;
  padding: ${8 / FONT_SIZE}rem ${14 / FONT_SIZE}rem;
  border-radius: ${16 / FONT_SIZE}rem;
  border-width: ${1 / FONT_SIZE}rem;
  white-space: normal;
  line-height: 1.3;

  &:not([disabled]):hover,
  &:not([disabled]):active,
  &:not([disabled]):focus {
    color: ${props => props.theme.buttonTextColorStr};
    background-color: ${props => props.theme.buttonColorStr};
    border-color: ${props => props.theme.buttonColorStr};
  }
`

export { Button }
