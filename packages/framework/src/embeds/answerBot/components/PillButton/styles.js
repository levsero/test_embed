import styled from 'styled-components'
import { FONT_SIZE } from 'src/constants/shared'
import { Button as GardenButton } from '@zendeskgarden/react-buttons'

const Button = styled(GardenButton)`
  &&& {
    background-color: transparent !important;
    color: ${props => props.theme.buttonColorStr} !important;
    border-color: ${props => props.theme.buttonColorStr} !important;
    font-size: ${15 / FONT_SIZE}rem !important;
    padding-right: ${24 / FONT_SIZE}rem !important;
    padding-left: ${24 / FONT_SIZE}rem !important;
    min-width: 0 !important;
    padding: ${8 / FONT_SIZE}rem ${14 / FONT_SIZE}rem !important;
    border-radius: ${16 / FONT_SIZE}rem !important;
    border-width: ${1 / FONT_SIZE}rem !important;
    white-space: normal !important;
    line-height: 1.3 !important;
    height: auto !important;

    &:not([disabled]):hover,
    &:not([disabled]):active,
    &:not([disabled]):focus {
      color: ${props => props.theme.buttonTextColorStr} !important;
      background-color: ${props => props.theme.buttonColorStr} !important;
      border-color: ${props => props.theme.buttonColorStr} !important;
    }
  }
`

export { Button }
