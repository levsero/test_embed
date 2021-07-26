import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
`
const Header = styled.div`
  position: fixed;
  left: ${(props) => props.theme.messenger.space.sm};
  top: ${(props) => props.theme.messenger.space.xs};
`

export { Container, Header }
