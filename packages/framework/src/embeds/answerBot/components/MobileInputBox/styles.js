import styled from 'styled-components'
import {
  zdColorGrey200,
  zdColorGrey300,
  zdColorGrey500,
  zdColorGrey700,
} from '@zendeskgarden/css-variables'
import { IconButton } from '@zendeskgarden/react-buttons'

const InputBoxContainer = styled.div`
  flex-grow: 1;
`

const Container = styled.div`
  ${(props) => {
    return `
      display: flex;
      align-items: center;
      box-shadow: 0 ${-1 / props.theme.fontSize}rem 0 0 ${zdColorGrey300} !important;
    `
  }}
`

const FooterIconButton = styled(IconButton)`
  ${(props) => {
    return `
      height: ${43 / props.theme.fontSize}rem !important;
      border-radius: 50% !important;
      margin: 0 ${4 / props.theme.fontSize}rem !important;

      svg {
        padding: ${8 / props.theme.fontSize}rem ${7 / props.theme.fontSize}rem ${
      8 / props.theme.fontSize
    }rem ${9 / props.theme.fontSize}rem;

        box-sizing: content-box;
        min-width: ${14 / props.theme.fontSize}rem;
        min-height: ${14 / props.theme.fontSize}rem;
        width: ${14 / props.theme.fontSize}rem;
        height: ${14 / props.theme.fontSize}rem;

        g {
          fill: ${zdColorGrey500} !important;
        }

        path {
          fill: ${zdColorGrey500} !important;
        }
      }

      &:hover,
      &:active,
      &:focus {
        cursor: pointer;
        background: ${zdColorGrey200};

        svg > g {
          fill: ${zdColorGrey700} !important;
        }
      }
    `
  }}
`

export { InputBoxContainer, Container, FooterIconButton }
