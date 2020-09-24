import styled from 'styled-components'

const Label = styled.div`
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin-bottom: ${props => props.theme.messenger.space.small};
`

const Value = styled.div``

export { Label, Value }
