import styled from 'styled-components'

const LayoutContainer = styled.div`
  align-self: flex-end;
  margin-right: ${props => props.theme.messenger.space.md};

  margin-top: ${props => (props.isFirstInGroup ? props.theme.messenger.space.sm : 0)};
`

export { LayoutContainer }
