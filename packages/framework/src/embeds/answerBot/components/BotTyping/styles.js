import styled from 'styled-components'
import { LoadingEllipses } from 'component/loading/LoadingEllipses'
import { zdColorGrey600, zdColorGrey100 } from '@zendeskgarden/css-variables'

const Container = styled.div`
  ${(props) => {
    return `
      display: inline-block;
      max-width: 100%;
      float: ${props.theme.rtl ? 'right' : 'left'};
      background: ${zdColorGrey100};
      border-radius: ${16 / props.theme.fontSize}rem;
      padding: ${8 / props.theme.fontSize}rem ${12 / props.theme.fontSize}rem;
      ${props.theme.rtl ? 'margin-right' : 'margin-left'}: ${40 / props.theme.fontSize}rem;
    `
  }}
`

const Loader = styled(LoadingEllipses)`
  ${(props) => {
    return `
      margin: ${4 / props.theme.fontSize}rem;

      div {
        width: ${5.5 / props.theme.fontSize}rem;
        height: ${5.5 / props.theme.fontSize}rem;
        background-color: ${zdColorGrey600};
        ${props.theme.rtl ? 'margin-left' : 'margin-right'}: ${4 / props.theme.fontSize}rem;
      }
    `
  }}
`

export { Container, Loader }
