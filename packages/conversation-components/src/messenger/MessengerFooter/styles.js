import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-shrink: 0;
  font-family: ${(props) => props.theme.messenger.fontFamily};
  padding: ${(props) => props.theme.messenger.space.sm} ${(props) => props.theme.messenger.space.sm}
    ${(props) => props.theme.messenger.space.sm} 0;
`

export { Container }
