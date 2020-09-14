import styled from 'styled-components'

const Text = styled.span`
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: ${props => props.theme.messenger.space.textMaxWidth};
  font-size: ${props => props.theme.messenger.fontSizes.md};
  line-height: ${props => props.theme.messenger.lineHeights.sm};
  width: auto;
`

const Padding = styled.div`
  padding-left: ${props => props.theme.messenger.space.sm};
  padding-right: ${props => props.theme.messenger.space.sm};
  padding-top: ${props => props.theme.messenger.space.xs};
  padding-bottom: ${props => props.theme.messenger.space.xs};
  width: 100%;
`

export { Text, Padding }
