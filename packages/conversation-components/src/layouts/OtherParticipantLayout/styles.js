import styled from 'styled-components'
import dirStyles from 'src/utils/dirStyles'

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  align-self: flex-start;
`

const VerticalContainer = styled.div`
  font-family: ${(props) => props.theme.messenger.fontFamily};
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  margin-${dirStyles.left}: ${(props) => props.theme.messenger.space.sixteen};
  margin-top: ${(props) => (props.isFirstInGroup ? props.theme.messenger.space.sm : 0)};
`

const OtherParticipantName = styled.p`
  margin-${dirStyles.left}: ${(props) => props.theme.messenger.space.xxl};
  font-size: ${(props) => props.theme.messenger.fontSizes.sm};
  font-weight: normal;
  line-height: ${(props) => props.theme.messenger.lineHeights.sm};
  color: ${(props) => props.theme.palette.grey[600]};
`

export { LayoutContainer, OtherParticipantName, VerticalContainer }
