import styled from 'styled-components'
import PillButton from 'src/embeds/answerBot/components/PillButton'

const Container = styled.div`
  ${props => {
    return `
      height: ${32 / props.theme.fontSize}rem;
      margin-bottom: ${10 / props.theme.fontSize}rem;
    `
  }}
`

const Button = styled(PillButton)`
  ${props => {
    return `
      &&&& {
        height: ${32 / props.theme.fontSize}rem !important;
        line-height: 1 !important;
        font-size: ${14 / props.theme.fontSize}rem !important;
        [dir='ltr'] & {
          right: 0;
        }
        [dir='rtl'] & {
          left: 0;
        }
        position: absolute;
      }
    `
  }}
`

export { Container, Button }
