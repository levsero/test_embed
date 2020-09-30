import styled from 'styled-components'

const Text = styled.span`
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: ${props => props.theme.messenger.space.textMaxWidth};
  font-size: ${props => props.theme.messenger.fontSizes.md};
  line-height: ${props => props.theme.messenger.lineHeights.sm};
  width: auto;
`

const Content = styled.div`
  padding: ${props => props.theme.messenger.space.xs} ${props => props.theme.messenger.space.sm};
  width: 100%;
`

export { Text, Content }