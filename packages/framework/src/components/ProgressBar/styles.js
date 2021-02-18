import styled, { css, keyframes } from 'styled-components'
import { zdColorGrey300, zdColorGreen500 } from '@zendeskgarden/css-variables'

const Container = styled.div`
  background-color: ${zdColorGrey300};
  border-radius: ${(props) => 4 / props.theme.fontSize}rem;
  margin-top: ${(props) => 5 / props.theme.fontSize}rem;
`

const growWidth = keyframes`
  from {
    width: 0;
  }
  to {
    width: 95%;
  }
`

const Progress = styled.div`
  height: ${(props) => 5 / props.theme.fontSize}rem;
  background-color: ${zdColorGreen500};
  border-radius: ${(props) => 4 / props.theme.fontSize}rem;
  width: ${(props) => props.percentLoaded};

  ${(props) =>
    props.fakeProgress &&
    css`
      animation: ${growWidth} 7s ease-out;
    `};
`

export { Container, Progress }
