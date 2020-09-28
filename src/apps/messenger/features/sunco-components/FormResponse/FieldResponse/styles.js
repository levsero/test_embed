import styled from 'styled-components'

const Label = styled.div`
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin-bottom: ${props => props.theme.messenger.space.small};
  word-break: break-word;
`

const Value = styled.div`
  word-break: break-word;
`

export { Label, Value }
