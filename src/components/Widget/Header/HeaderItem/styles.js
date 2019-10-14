import styled, { css } from 'styled-components'
import { IconButton } from '@zendeskgarden/react-buttons'
import { FONT_SIZE } from 'constants/shared'

const StyledIconButton = styled(IconButton)`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1rem !important;
    height: 1rem !important;
  }

  ${props => {
    if (!props.theme.headerTextColorStr) {
      return ''
    }

    return css`
      svg,
      path {
        fill: ${props => props.theme.headerTextColorStr} !important;
        color: ${props => props.theme.headerTextColorStr} !important;
      }
    `
  }}

  &:focus {
    outline: none !important;
    box-shadow: 0 0 0 ${3 / FONT_SIZE}rem rgba(255, 255, 255, 0.4) !important;
  }
`

export { StyledIconButton as IconButton }
