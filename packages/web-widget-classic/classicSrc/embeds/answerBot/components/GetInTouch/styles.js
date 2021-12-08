import PillButton from 'classicSrc/embeds/answerBot/components/PillButton'
import styled from 'styled-components'

const Container = styled.div`
  ${(props) => {
    return `
      height: ${32 / props.theme.fontSize}rem;
      margin-bottom: ${10 / props.theme.fontSize}rem;
    `
  }}
`

const Button = styled(PillButton)`
  ${(props) => {
    return `
      &&&& {
        height: ${32 / props.theme.fontSize}rem !important;
        line-height: 1 !important;
        font-size: ${14 / props.theme.fontSize}rem !important;
        ${props.theme.rtl ? 'left' : 'right'}: 0;
        position: absolute;
      }
    `
  }}
`

export { Container, Button }
