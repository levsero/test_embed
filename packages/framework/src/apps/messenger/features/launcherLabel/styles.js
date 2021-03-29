import styled, { createGlobalStyle, keyframes } from 'styled-components'
import { dirStyles } from '@zendesk/conversation-components'

const onLoadFadeIn = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
`

const Container = styled.div`
  position: absolute;
  bottom: 30px;
  ${(props) => `${props.position === 'left' ? 'left' : 'right'}: 0;`}
  display: flex;
  justify-content: ${dirStyles.swap('flex-end', 'flex-start')};
  animation: ${onLoadFadeIn} 0.2s ease-in;
`

const GlobalStyles = createGlobalStyle`
  html {
    background-color: transparent;
  }
`

export { Container, GlobalStyles }
