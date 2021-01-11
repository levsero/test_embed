import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  height: wrap-content;
  display: flex;
  flex-direction: column;
  margin-top: ${props => props.theme.messenger.space.sm};
`

const Text = styled.p`
  font-size: ${props => props.theme.messenger.fontSizes.sm};
  line-height: ${props => props.theme.messenger.lineHeights.sm};
  height: ${props => props.theme.messenger.space.sixteen};
  letter-spacing: 0;
  color: ${props => props.theme.palette.grey[600]};
  align-self: center;
`

export { Container, Text }
