import { SlideAppear } from 'classicSrc/component/transition/SlideAppear'
import styled from 'styled-components'

const Container = styled.div`
  ${(props) => {
    return `
      position: relative !important;
      margin-bottom: ${5 / props.theme.fontSize}rem !important;
    `
  }}
`

const Message = styled.div`
  &:before,
  &:after {
    content: ' ';
    display: table;
  }

  &:after {
    clear: both;
  }

  display: block !important;
`

const Slide = styled(SlideAppear)`
  position: relative;
`

export { Container, Message, Slide as SlideAppear }
