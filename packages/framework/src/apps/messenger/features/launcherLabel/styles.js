import styled, { createGlobalStyle } from 'styled-components'
import { dirStyles } from '@zendesk/conversation-components'

const Container = styled.div`
  position: absolute;
  bottom: 30px;
  ${(props) => `${props.position === 'left' ? 'left' : 'right'}: 0;`}
  display: flex;
  justify-content: ${dirStyles.swap('flex-end', 'flex-start')};
`

const GlobalStyles = createGlobalStyle`
  html {
    background-color: transparent;
  }
`

export { Container, GlobalStyles }
