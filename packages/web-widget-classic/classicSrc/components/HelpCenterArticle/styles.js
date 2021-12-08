import { darken, getLuminance, lighten } from 'polished'
import styled from 'styled-components'

const Container = styled.div`
  &&& {
    a {
      color: ${(props) => props.theme.linkColorStr};
      text-decoration: underline;

      &:hover,
      &:focus {
        text-decoration: underline;
        color: ${(props) =>
          getLuminance(props.theme.linkColorStr) > 0.13
            ? darken(0.2, props.theme.linkColorStr)
            : lighten(0.2, props.theme.linkColorStr)};
      }
    }
  }
`

export { Container }
