import styled from 'styled-components'

const Header = styled.div`
  position: fixed;
  left: ${(props) => props.theme.messenger.space.sm};
  top: ${(props) => props.theme.messenger.space.xs};
`

export { Header }
