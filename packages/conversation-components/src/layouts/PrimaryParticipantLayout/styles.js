import styled from 'styled-components'
import dirStyles from 'src/utils/dirStyles'

const LayoutContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-self: flex-end;
`

const VerticalLayout = styled.div`
  font-family: ${props => props.theme.messenger.fontFamily};
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  margin-top: ${props => (props.isFirstInGroup ? props.theme.messenger.space.sm : 0)};
  margin-${dirStyles.right}: ${props => props.theme.messenger.space.sixteen};
`

export { LayoutContainer, VerticalLayout }
