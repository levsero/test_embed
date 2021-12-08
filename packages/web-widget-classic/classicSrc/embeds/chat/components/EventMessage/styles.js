import styled, { css } from 'styled-components'
import { zdColorGrey600 } from '@zendeskgarden/css-variables'

const Message = styled.div`
  text-align: center;
  margin-top: ${(props) => 5 / props.theme.fontSize}rem;
  margin-bottom: ${(props) => 10 / props.theme.fontSize}rem;
  color: ${zdColorGrey600};
  ${(props) => {
    if (props.showAnimation) {
      return css`
        animation: fadeIn 200ms 1 ease-in-out;
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `
    }
  }}
`
export { Message }
