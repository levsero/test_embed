import styled from 'styled-components'

const LayoutContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-right: ${props => props.theme.messenger.space.md};

  margin-top: ${props => (props.isFirstInGroup ? props.theme.messenger.space.sm : 0)};
`

export { LayoutContainer }
