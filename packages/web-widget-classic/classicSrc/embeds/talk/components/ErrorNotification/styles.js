import { FONT_SIZE } from 'classicSrc/constants/shared'
import styled from 'styled-components'
import {
  zdColorRed300,
  zdColorRed500,
  zdColorRed600,
  zdColorRed700,
  zdColorWhite,
} from '@zendeskgarden/css-variables'
import ErrorIcon from '@zendeskgarden/svg-icons/src/14/error.svg'

const Container = styled.div`
  margin-bottom: ${15 / FONT_SIZE}rem !important;
  display: flex !important;
  background-color: rgba(${zdColorRed500}, 0.1);
  border-radius: ${4 / FONT_SIZE}rem;
  border: ${1 / FONT_SIZE}rem solid ${zdColorRed300};
  color: ${zdColorRed700};
  padding: ${13 / FONT_SIZE}rem ${13 / FONT_SIZE}rem;
  line-height: ${18 / FONT_SIZE}rem;
`

const StyledErrorIcon = styled(ErrorIcon)`
  margin-top: ${2 / FONT_SIZE}rem;
  margin-right: ${12 / FONT_SIZE}rem;
  min-width: ${14 / FONT_SIZE}rem;
  min-height: ${14 / FONT_SIZE}rem;
  width: ${14 / FONT_SIZE}rem;
  height: ${14 / FONT_SIZE}rem;

  g {
    circle {
      stroke: ${zdColorRed600};
      fill: ${zdColorRed600};
    }

    path {
      stroke: ${zdColorWhite};
    }
  }

  circle {
    fill: ${zdColorWhite};
  }
`

export { Container, StyledErrorIcon as ErrorIcon }
