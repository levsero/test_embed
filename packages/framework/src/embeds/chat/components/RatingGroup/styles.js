import styled from 'styled-components'
import { IconButton } from '@zendeskgarden/react-buttons'
import { FONT_SIZE } from 'constants/shared'

const Container = styled.div`
  display: inline-flex;
  flex-shrink: 0;
`

const RatingButton = styled(IconButton)`
  &&& {
  ${(props) =>
    props.selected &&
    `
      background-color: ${props.theme.baseColor} !important;
      color: ${props.theme.headerTextColorStr} !important;

      &:hover, &:focus {
        background-color: ${props.theme.baseHighlightColor} !important
      }
  `}

  & {
    width: 3rem;
    height: 3rem;
  }

  svg {
    width: 42%;
    height: 42%;
  }

  &:focus {
    box-shadow: inset 0 0 0 ${3 / FONT_SIZE}rem ${(props) =>
  props.selected ? 'rgba(255,255,255,0.4)' : props.theme.headerFocusRingColorStr} !important;
  }
`
export { Container, RatingButton }
