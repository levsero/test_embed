import styled from 'styled-components'

const LayoutContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: ${props => (props.isFirstInGroup ? props.theme.messenger.space.sm : 0)};

  align-self: flex-end;
`

const VerticalLayout = styled.div`
  align-self: flex-end;
  display: flex;
  flex-direction: column;
  margin-right: ${props => props.theme.messenger.space.sixteen};
`

export { LayoutContainer, VerticalLayout }
